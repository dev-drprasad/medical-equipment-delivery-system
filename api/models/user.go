package models

import (
	"log"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID             uint64  `json:"id" db:"id"`
	Name           string  `json:"name" db:"name"`
	Username       string  `json:"username" db:"username"`
	HashedPassword string  `db:"hashedPassword" json:"-"`
	Password       string  `json:"password" db:"-"`
	TeamID         *uint64 `json:"teamId" db:"team"`

	Team *Team `json:"team,omitempty"`
}

func (u *User) ValidatePassword(password string) bool {
	if err := bcrypt.CompareHashAndPassword([]byte(u.HashedPassword), []byte(password)); err != nil {
		log.Println("Password validation failed", " <- ", err)
		return false
	}
	return true
}

func (u *User) CreatePassword(password string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if err != nil {
		log.Println("Could not generate password", " : ", err)
		return err
	}
	u.HashedPassword = string(hash)
	return nil
}

func (u *User) GenerateToken(sugar string) (string, error) {
	claims := jwt.MapClaims{}
	claims["userId"] = u.ID
	claims["username"] = u.Username
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(sugar))
}
