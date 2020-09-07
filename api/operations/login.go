package operations

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
)

func Login(db *sqlx.DB, sugar string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		dec := json.NewDecoder(r.Body)
		var body map[string]string
		if err := dec.Decode(&body); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		username := body["username"]
		password := body["password"]

		u := models.User{Team: &models.Team{}}
		err := db.QueryRow("SELECT user.id,user.username,user.hashedPassword,user.name,team.role FROM user LEFT JOIN team ON user.team = team.id WHERE username = ?", username).
			Scan(&u.ID, &u.Username, &u.HashedPassword, &u.Name, &u.Team.RoleID)

		if err == sql.ErrNoRows {
			log.Println("User does not exist")
			w.WriteHeader(http.StatusUnauthorized)
			return
		} else if err != nil {
			log.Println("Could not find user by username", " <- ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if !u.ValidatePassword(password) {
			log.Println("Could not authenticate user", " <- ", "Invalid password")
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		tokenStr, err := u.GenerateToken(sugar)
		if err != nil {
			log.Println("Could not sign jwt token", " <- ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		b, err := json.Marshal(u)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		log.Println("User authenticated successfully!")
		w.Header().Add("X-Token", tokenStr)
		w.WriteHeader(http.StatusOK)
		w.Write(b)

		l := models.Log{
			Message: "logged in",
			UserID:  u.ID,
		}
		_, err = db.Exec("INSERT INTO `log`(message, userId, meta) VALUES(?, ?, ?)", l.Message, l.UserID, "{}")
		if err != nil {
			log.Println("Logging failed <- ", err)
		}
		return
	})
}
