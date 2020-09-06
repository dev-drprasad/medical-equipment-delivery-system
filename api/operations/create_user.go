package operations

import (
	"encoding/json"
	"log"
	"net/http"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		dec := json.NewDecoder(r.Body)
		var u models.User
		if err := dec.Decode(&u); err != nil {
			log.Println("Could not decode request body", " : ", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.MinCost)
		if err != nil {
			log.Println("Could not create user", " : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		u.Password = string(hash)

		result, err := db.Exec(`INSERT INTO user(name, username, password, team) VALUES(?, ?, ?, ?)`, &u.Name, &u.Username, &u.Password, &u.TeamID)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		rowsAffected, _ := result.RowsAffected()
		if rowsAffected != 1 {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Add("Content-Type", "application/json")
		w.Write([]byte("{}"))
	})
}
