package main

import (
	"context"
	"crypto/rand"
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Models
type User struct {
	ID                 uint           `json:"id" gorm:"primaryKey"`
	Email              string         `json:"email" gorm:"uniqueIndex;not null"`
	Password           string         `json:"-" gorm:"not null"`
	Name               string         `json:"name" gorm:"not null"`
	Phone              string         `json:"phone"`
	Avatar             string         `json:"avatar"`
	Role               string         `json:"role" gorm:"default:client"` // client, therapist, admin
	IsEmailVerified    bool           `json:"is_email_verified" gorm:"default:false"`
	EmailVerifyToken   string         `json:"-"`
	PasswordResetToken string         `json:"-"`
	LastLoginAt        *time.Time     `json:"last_login_at"`
	CreatedAt          time.Time      `json:"created_at"`
	UpdatedAt          time.Time      `json:"updated_at"`
	DeletedAt          gorm.DeletedAt `json:"-" gorm:"index"`
}

type RefreshToken struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"not null"`
	Token     string    `json:"token" gorm:"unique;not null"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
	User      User      `json:"user" gorm:"foreignKey:UserID"`
}

type Therapist struct {
	ID             uint       `json:"id" gorm:"primaryKey"`
	UserID         uint       `json:"user_id"`
	User           User       `json:"user" gorm:"foreignKey:UserID"`
	Specialization string     `json:"specialization"`
	Approach       string     `json:"approach"`
	Experience     int        `json:"experience"`     // years
	PricePerHour   int        `json:"price_per_hour"` // in kopecks
	Rating         float64    `json:"rating"`
	ReviewCount    int        `json:"review_count"`
	Bio            string     `json:"bio"`
	Languages      string     `json:"languages"` // JSON array as string
	IsOnline       bool       `json:"is_online"`
	NextSlot       *time.Time `json:"next_available_slot"`
	CreatedAt      time.Time  `json:"created_at"`
}

type Session struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	ClientID    uint      `json:"client_id"`
	TherapistID uint      `json:"therapist_id"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
	Status      string    `json:"status"` // scheduled, active, completed, cancelled
	Price       int       `json:"price"`
	CreatedAt   time.Time `json:"created_at"`
}

// JWT Claims
type Claims struct {
	UserID uint   `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// Request/Response types
type ApiResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Meta    interface{} `json:"meta,omitempty"`
}

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Name     string `json:"name" binding:"required"`
	Phone    string `json:"phone"`
	Role     string `json:"role"` // optional, defaults to "client"
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type TokenPair struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int64  `json:"expires_in"`
}

type TherapistListResponse struct {
	Therapists []Therapist `json:"therapists"`
	Total      int64       `json:"total"`
	Page       int         `json:"page"`
	PerPage    int         `json:"per_page"`
}

type StatsResponse struct {
	TotalTherapists  int     `json:"total_therapists"`
	TotalSessions    int     `json:"total_sessions"`
	ActiveTherapists int     `json:"active_therapists"`
	AverageRating    float64 `json:"average_rating"`
}

// Global variables
var db *gorm.DB
var rdb *redis.Client

// Database initialization
func initDB() {
	var err error

	_ = godotenv.Load()

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is not set")
	}

	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	db.AutoMigrate(&User{}, &RefreshToken{}, &Therapist{}, &Session{})
	seedData()
	log.Println("Database connected and migrated successfully")
}

func initRedis() {
	redisURL := os.Getenv("REDIS_URL")
	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Fatalf("Ошибка парсинга REDIS_URL: %v", err)
	}

	// Upstash требует TLS
	opt.TLSConfig = &tls.Config{}

	rdb = redis.NewClient(opt)

	// Проверим соединение
	if err := rdb.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("Ошибка подключения к Redis: %v", err)
	}

	log.Println("Redis подключён успешно")
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func seedData() {
	// Check if data already exists
	var count int64
	db.Model(&Therapist{}).Count(&count)
	if count > 0 {
		return
	}

	// Create sample therapists with users
	users := []User{
		{
			Name:            "Анна Смирнова",
			Email:           "anna@psyportal.com",
			Phone:           "+7 (123) 456-78-90",
			Role:            "therapist",
			IsEmailVerified: true,
		},
		{
			Name:            "Михаил Петров",
			Email:           "mikhail@psyportal.com",
			Phone:           "+7 (123) 456-78-91",
			Role:            "therapist",
			IsEmailVerified: true,
		},
		{
			Name:            "Елена Волкова",
			Email:           "elena@psyportal.com",
			Phone:           "+7 (123) 456-78-92",
			Role:            "therapist",
			IsEmailVerified: true,
		},
		{
			Name:            "Дмитрий Козлов",
			Email:           "dmitry@psyportal.com",
			Phone:           "+7 (123) 456-78-93",
			Role:            "therapist",
			IsEmailVerified: true,
		},
	}

	// Set default password for all sample users
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	for i := range users {
		users[i].Password = string(hashedPassword)
	}

	// Create users first
	for i := range users {
		db.Create(&users[i])
	}

	// Create therapist profiles
	therapists := []Therapist{
		{
			UserID:         users[0].ID,
			Specialization: "Тревожные расстройства",
			Approach:       "Когнитивно-поведенческая терапия",
			Experience:     7,
			PricePerHour:   315000,
			Rating:         4.8,
			ReviewCount:    124,
			Bio:            "Специализируюсь на работе с тревожностью, паническими атаками и депрессией.",
			Languages:      `["Русский", "Английский"]`,
			IsOnline:       true,
		},
		{
			UserID:         users[1].ID,
			Specialization: "Семейная терапия",
			Approach:       "Системная семейная терапия",
			Experience:     12,
			PricePerHour:   420000,
			Rating:         4.9,
			ReviewCount:    89,
			Bio:            "Работаю с парами и семьями. Помогаю восстановить понимание и близость в отношениях.",
			Languages:      `["Русский"]`,
			IsOnline:       true,
		},
		{
			UserID:         users[2].ID,
			Specialization: "Детская психология",
			Approach:       "Игровая терапия",
			Experience:     5,
			PricePerHour:   280000,
			Rating:         4.7,
			ReviewCount:    156,
			Bio:            "Специализируюсь на работе с детьми и подростками. Использую игровые методы и арт-терапию.",
			Languages:      `["Русский", "Украинский"]`,
			IsOnline:       false,
		},
		{
			UserID:         users[3].ID,
			Specialization: "Зависимости",
			Approach:       "12-шаговая программа",
			Experience:     9,
			PricePerHour:   380000,
			Rating:         4.6,
			ReviewCount:    67,
			Bio:            "Помогаю в преодолении различных зависимостей. Большой опыт работы с созависимостью.",
			Languages:      `["Русский", "Английский"]`,
			IsOnline:       true,
		},
	}

	for _, therapist := range therapists {
		db.Create(&therapist)
	}

	log.Println("Sample data seeded successfully")
}

// Auth helpers
func generateRandomToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(bytes), nil
}

func generateTokens(user *User) (*TokenPair, error) {
	log.Printf("Generating tokens for user: %d", user.ID)

	// Generate Access Token (15 minutes)
	accessClaims := &Claims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	jwtSecret := getEnv("JWT_SECRET", "your-secret-key-change-in-production")

	if jwtSecret == "" {
		log.Printf("JWT_SECRET is empty!")
		return nil, errors.New("JWT secret not configured")
	}

	log.Printf("Using JWT secret length: %d", len(jwtSecret))

	accessTokenString, err := accessToken.SignedString([]byte(jwtSecret))
	if err != nil {
		log.Printf("Error signing access token: %v", err)
		return nil, err
	}

	// Generate Refresh Token
	refreshTokenString, err := generateRandomToken()
	if err != nil {
		log.Printf("Error generating refresh token: %v", err)
		return nil, err
	}

	// Save Refresh Token in database
	refreshToken := &RefreshToken{
		UserID:    user.ID,
		Token:     refreshTokenString,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour), // 7 days
	}

	log.Printf("Saving refresh token to database...")
	if err := db.Create(refreshToken).Error; err != nil {
		log.Printf("Error saving refresh token: %v", err)
		return nil, err
	}

	log.Printf("Tokens generated successfully")
	return &TokenPair{
		AccessToken:  accessTokenString,
		RefreshToken: refreshTokenString,
		ExpiresIn:    900, // 15 minutes
	}, nil
}

func verifyToken(tokenString string) (*Claims, error) {
	jwtSecret := getEnv("JWT_SECRET", "your-secret-key-change-in-production")
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("недействительный токен")
}

// Middleware
func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, ApiResponse{
				Success: false,
				Error:   "Требуется авторизация",
			})
			c.Abort()
			return
		}

		// Extract token from "Bearer <token>"
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, ApiResponse{
				Success: false,
				Error:   "Неверный формат токена",
			})
			c.Abort()
			return
		}

		claims, err := verifyToken(tokenParts[1])
		if err != nil {
			c.JSON(http.StatusUnauthorized, ApiResponse{
				Success: false,
				Error:   "Недействительный токен",
			})
			c.Abort()
			return
		}

		// Set user info in context
		c.Set("user_id", claims.UserID)
		c.Set("user_email", claims.Email)
		c.Set("user_role", claims.Role)
		c.Next()
	}
}

// Auth handlers
func register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Success: false,
			Error:   "Неверные данные: " + err.Error(),
		})
		return
	}

	// Check if user already exists
	var existingUser User
	if err := db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Success: false,
			Error:   "Пользователь с таким email уже существует",
		})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ApiResponse{
			Success: false,
			Error:   "Ошибка при обработке пароля",
		})
		return
	}

	// Generate email verification token
	verifyToken, err := generateRandomToken()
	if err != nil {
		c.JSON(http.StatusInternalServerError, ApiResponse{
			Success: false,
			Error:   "Ошибка при генерации токена",
		})
		return
	}

	// Set default role
	role := req.Role
	if role == "" {
		role = "client"
	}

	// Create user
	user := &User{
		Email:            req.Email,
		Password:         string(hashedPassword),
		Name:             req.Name,
		Phone:            req.Phone,
		Role:             role,
		EmailVerifyToken: verifyToken,
	}

	if err := db.Create(user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, ApiResponse{
			Success: false,
			Error:   "Ошибка при создании пользователя",
		})
		return
	}

	c.JSON(http.StatusCreated, ApiResponse{
		Success: true,
		Data: gin.H{
			"user":    user,
			"message": "Регистрация успешна. Проверьте email для подтверждения аккаунта.",
		},
	})
}

func login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Success: false,
			Error:   "Неверные данные: " + err.Error(),
		})
		return
	}

	var user User
	if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, ApiResponse{
			Success: false,
			Error:   "Неверный email или пароль",
		})
		return
	}

	// Check password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, ApiResponse{
			Success: false,
			Error:   "Неверный email или пароль",
		})
		return
	}

	// Generate tokens
	tokens, err := generateTokens(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ApiResponse{
			Success: false,
			Error:   "Ошибка при генерации токенов",
		})
		return
	}

	// Update last login time
	now := time.Now()
	user.LastLoginAt = &now
	db.Save(&user)

	c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Data: gin.H{
			"user":   user,
			"tokens": tokens,
		},
	})
}

func refreshToken(c *gin.Context) {
	var req RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Success: false,
			Error:   "Неверные данные: " + err.Error(),
		})
		return
	}

	var refreshToken RefreshToken
	if err := db.Preload("User").Where("token = ? AND expires_at > ?",
		req.RefreshToken, time.Now()).First(&refreshToken).Error; err != nil {
		c.JSON(http.StatusUnauthorized, ApiResponse{
			Success: false,
			Error:   "Недействительный refresh token",
		})
		return
	}

	// Delete old refresh token
	db.Delete(&refreshToken)

	// Generate new token pair
	tokens, err := generateTokens(&refreshToken.User)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ApiResponse{
			Success: false,
			Error:   "Ошибка при генерации токенов",
		})
		return
	}

	c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Data: gin.H{
			"tokens": tokens,
		},
	})
}

func logout(c *gin.Context) {
	var req RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ApiResponse{
			Success: false,
			Error:   "Неверные данные: " + err.Error(),
		})
		return
	}

	// Delete refresh token
	db.Where("token = ?", req.RefreshToken).Delete(&RefreshToken{})

	c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Data: gin.H{
			"message": "Выход выполнен успешно",
		},
	})
}

func getProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, ApiResponse{
			Success: false,
			Error:   "Пользователь не авторизован",
		})
		return
	}

	var user User
	if err := db.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, ApiResponse{
			Success: false,
			Error:   "Пользователь не найден",
		})
		return
	}

	c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Data:    user,
	})
}

// Existing handlers
func getTherapists(c *gin.Context) {
	var therapists []Therapist
	var total int64

	// Parse query parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	perPage, _ := strconv.Atoi(c.DefaultQuery("per_page", "10"))

	if page < 1 {
		page = 1
	}
	if perPage < 1 || perPage > 50 {
		perPage = 10
	}

	offset := (page - 1) * perPage

	// Build query
	query := db.Model(&Therapist{}).Preload("User")

	// Apply filters
	if spec := c.Query("specialization"); spec != "" {
		query = query.Where("specialization ILIKE ?", "%"+spec+"%")
	}

	if approach := c.Query("approach"); approach != "" {
		query = query.Where("approach ILIKE ?", "%"+approach+"%")
	}

	if minExp := c.Query("min_experience"); minExp != "" {
		if exp, err := strconv.Atoi(minExp); err == nil {
			query = query.Where("experience >= ?", exp)
		}
	}

	if maxPrice := c.Query("max_price"); maxPrice != "" {
		if price, err := strconv.Atoi(maxPrice); err == nil {
			query = query.Where("price_per_hour <= ?", price*100)
		}
	}

	if onlineOnly := c.Query("online_only"); onlineOnly == "true" {
		query = query.Where("is_online = ?", true)
	}

	// Get total count
	query.Count(&total)

	// Get therapists with pagination
	result := query.Offset(offset).Limit(perPage).Find(&therapists)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, ApiResponse{
			Success: false,
			Error:   "Failed to fetch therapists",
		})
		return
	}

	response := TherapistListResponse{
		Therapists: therapists,
		Total:      total,
		Page:       page,
		PerPage:    perPage,
	}

	c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Data:    response,
	})
}

func getStats(c *gin.Context) {
	ctx := context.Background()
	cacheKey := "platform:stats"

	// Try to get from cache if Redis is available
	if rdb != nil {
		cached, err := rdb.Get(ctx, cacheKey).Result()
		if err == nil {
			var stats StatsResponse
			if json.Unmarshal([]byte(cached), &stats) == nil {
				c.JSON(http.StatusOK, ApiResponse{
					Success: true,
					Data:    stats,
				})
				return
			}
		}
	}

	// Calculate stats
	var stats StatsResponse
	var totalTherapists, totalSessions, activeTherapists int64
	var avgRating float64

	db.Model(&Therapist{}).Count(&totalTherapists)
	db.Model(&Session{}).Count(&totalSessions)
	db.Model(&Therapist{}).Where("is_online = ?", true).Count(&activeTherapists)
	db.Model(&Therapist{}).Select("COALESCE(AVG(rating), 0)").Scan(&avgRating)

	stats.TotalTherapists = int(totalTherapists)
	stats.TotalSessions = int(totalSessions)
	stats.ActiveTherapists = int(activeTherapists)
	stats.AverageRating = avgRating

	// Cache for 5 minutes if Redis is available
	if rdb != nil {
		statsJSON, _ := json.Marshal(stats)
		rdb.Set(ctx, cacheKey, statsJSON, 5*time.Minute)
	}

	c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Data:    stats,
	})
}

func getTherapistById(c *gin.Context) {
	id := c.Param("id")

	var therapist Therapist
	result := db.Preload("User").First(&therapist, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, ApiResponse{
			Success: false,
			Error:   "Therapist not found",
		})
		return
	}

	c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Data:    therapist,
	})
}

func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, ApiResponse{
		Success: true,
		Data: map[string]string{
			"status": "healthy",
			"time":   time.Now().Format(time.RFC3339),
		},
	})
}

func main() {
	// Initialize services
	initDB()
	initRedis()

	// Setup Gin
	r := gin.Default()
	
	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
			"http://localhost:3001",
			"https://psy-portal.vercel.app/",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// API routes
	api := r.Group("/api/v1")
	{
		// Public routes
		api.GET("/health", healthCheck)
		api.GET("/stats", getStats)

		// Auth routes
		auth := api.Group("/auth")
		{
			auth.POST("/register", register)
			auth.POST("/login", login)
			auth.POST("/refresh", refreshToken)
			auth.POST("/logout", logout)
		}

		// Public therapist routes (for browsing)
		api.GET("/therapists", getTherapists)
		api.GET("/therapists/:id", getTherapistById)

		// Protected routes
		protected := api.Group("")
		protected.Use(authMiddleware())
		{
			protected.GET("/profile", getProfile)
			// Add more protected routes here
		}
	}

	port := getEnv("PORT", "8080")
	fmt.Printf("🚀 PsyPortal Server starting on :%s\n", port)
	fmt.Printf("📊 Health check: http://localhost:%s/api/v1/health\n", port)
	fmt.Printf("🔐 Auth endpoints:\n")
	fmt.Printf("   POST http://localhost:%s/api/v1/auth/register\n", port)
	fmt.Printf("   POST http://localhost:%s/api/v1/auth/login\n", port)
	fmt.Printf("   POST http://localhost:%s/api/v1/auth/refresh\n", port)
	fmt.Printf("   POST http://localhost:%s/api/v1/auth/logout\n", port)
	fmt.Printf("👥 Therapists API: http://localhost:%s/api/v1/therapists\n", port)

	log.Fatal(r.Run(":" + port))
}
