package operations

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
)

func GetSalesUsers(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		query := fmt.Sprintf("SELECT user.id,user.name FROM user LEFT JOIN team ON user.team = team.id WHERE team.role='Sales' ORDER BY user.name ASC")
		rows, err := db.Query(query)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		users := []models.User{}
		for rows.Next() {
			u := models.User{Team: &models.Team{}}
			err := rows.Scan(&u.ID, &u.Name)
			if err != nil {
				log.Println(err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			users = append(users, u)
		}

		b, err := json.Marshal(users)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.Write(b)
	})
}
