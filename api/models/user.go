package models

import (
	"log"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       uint64  `json:"id" db:"id"`
	Name     string  `json:"name" db:"name"`
	Username string  `json:"username" db:"username"`
	Password string  `json:"-" db:"password"`
	TeamID   *uint64 `json:"teamId" db:"team"`

	Team *Team `json:"team,omitempty"`
}

func (u *User) ValidatePassword(password string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password)); err != nil {
		log.Println("Password validation failed", " <- ", err)
		return false
	}
	return true
}

func (u *User) GenerateToken(sugar string) (string, error) {
	claims := jwt.MapClaims{}
	claims["userId"] = u.ID
	claims["username"] = u.Username
	claims["exp"] = time.Now().Add(time.Hour * 24 * 30).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(sugar))
}
