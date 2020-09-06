package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"breath-right-one/api/operations"

	"github.com/dgrijalva/jwt-go"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/context"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

var db *sqlx.DB
var sugar string

func init() {
	// flag.StringVar(&sugar, "sugar", "", "Secret Sugar for Signing Tokens")
	// flag.Parse()
	sugar = os.Getenv("SUGAR")
	// dbUser := os.Getenv("DB_USER")
	// dbPass := os.Getenv("DB_PASSWORD")
	// dbName := os.Getenv("DB_NAME")
	// dbHost := os.Getenv("DB_HOST")
	// dbPort := os.Getenv("DB_PORT")
	var err error
	// db, err = sqlx.Connect("mysql", dbUser+":"+dbPass+"@tcp("+dbHost+":"+dbPort+"/"+dbName)
	connString := os.Getenv("DB_CONN_STRING")
	fmt.Println(connString)
	time.Sleep(10 * time.Second)
	db, err = sqlx.Connect("mysql", connString)
	if err != nil {
		panic(err.Error())
	}
}

func authCheck(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")
		tokenStr := strings.TrimPrefix(header, "Bearer ")
		if tokenStr == "" {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		claims := jwt.MapClaims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			// Don't forget to validate the alg is what you expect:
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				msg := fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
				return nil, msg
			}
			return []byte(sugar), nil
		})

		if err != nil {
			log.Println(err)
			http.Error(w, "Error parsing token", http.StatusUnauthorized)
			return
		}

		if token == nil || !token.Valid {
			http.Error(w, http.StatusText(http.StatusUnauthorized), http.StatusUnauthorized)
			return
		}

		context.Set(r, "userId", claims["userId"])
		next.ServeHTTP(w, r)
	})
}

func main() {
	r := mux.NewRouter()
	secure := r.PathPrefix("/api").Subrouter()
	secure.Use(authCheck)
	r.Handle("/api/v1/login", operations.Login(db, sugar)).Methods("POST")
	secure.Handle("/v1/patients", operations.GetPatients(db)).Methods("GET")
	secure.Handle("/v1/patients", operations.AddPatient(db)).Methods("POST")
	secure.Handle("/v1/insurers", operations.GetInsurers(db)).Methods("GET")
	secure.Handle("/v1/insurers", operations.AddInsurer(db)).Methods("POST")
	secure.Handle("/v1/physicians", operations.GetPhysicians(db)).Methods("GET")
	secure.Handle("/v1/physicians", operations.AddPhysician(db)).Methods("POST")
	secure.Handle("/v1/orders", operations.GetOrders(db)).Methods("GET")
	secure.Handle("/v1/orders", operations.CreateOrder(db)).Methods("POST")
	secure.Handle("/v1/orders/{id}", operations.GetOrder(db)).Methods("GET")
	secure.Handle("/v1/orders/{id}/comments", operations.AddCommentByOrderID(db)).Methods("POST")
	secure.Handle("/v1/orders/{id}/comments", operations.GetCommentsByOrderID(db)).Methods("GET")
	secure.Handle("/v1/orders/{id}/saleUsers", operations.GetOrderSalesUsers(db)).Methods("GET")
	secure.Handle("/v1/orders/{id}/documents", operations.GetOrderDocuments(db)).Methods("GET")
	secure.Handle("/v1/orders/{id}/documents/upload", operations.UploadOrderDocument(db)).Methods("POST")
	secure.Handle("/v1/orders/{id}/status", operations.UpdateOrderStatus(db)).Methods("POST")
	secure.Handle("/v1/orders/{id}/appointment", operations.UpdateOrderAppointment(db)).Methods("POST")
	secure.Handle("/v1/teams", operations.GetTeams(db)).Methods("GET")
	secure.Handle("/v1/teams", operations.CreateTeam(db)).Methods("POST")
	secure.Handle("/v1/users", operations.GetUsers(db)).Methods("GET")
	secure.Handle("/v1/users", operations.CreateUser(db)).Methods("POST")
	secure.Handle("/v1/roles", operations.GetRoles(db)).Methods("GET")
	secure.Handle("/v1/equipments", operations.GetEquipments(db)).Methods("GET")
	secure.Handle("/v1/equipments", operations.AddEquipment(db)).Methods("POST")
	secure.Handle("/v1/orderstatuses", operations.GetOrderStatuses(db)).Methods("GET")

	allowedMethods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS", "DELETE"})
	allowedHeaders := handlers.AllowedHeaders([]string{"jwt", "build", "Content-Type", "content-type"})
	exposedHeaders := handlers.ExposedHeaders([]string{"jwt", "build", "Content-Type", "content-type"})

	log.Println("Starting server...")
	log.Fatalln(http.ListenAndServe(fmt.Sprintf("%s:%d", "", 8000), handlers.CORS(exposedHeaders, allowedHeaders, allowedMethods)(r)))
}
