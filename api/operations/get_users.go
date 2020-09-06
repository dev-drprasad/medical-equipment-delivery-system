package operations

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
)

func GetUsers(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		tags := getJSONFieldTags(models.User{})

		where := ""
		placeholder := []string{}
		args := []interface{}{}
		for _, t := range tags {
			if r.URL.Query().Get(t) != "" {
				v := r.URL.Query().Get(t)
				// filters[t] = r.URL.Query().Get(t)
				placeholder = append(placeholder, fmt.Sprintf("%s = ?", t))
				args = append(args, v)
			}
		}
		if len(placeholder) > 0 {
			where += "WHERE" + " " + strings.Join(placeholder, " AND ")
		}

		query := fmt.Sprintf("SELECT user.id,user.name,user.username,team.id,team.name FROM user LEFT JOIN team ON user.team = team.id %s ORDER BY user.id DESC", where)
		log.Println(query)
		rows, err := db.Query(query, args...)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		users := []models.User{}
		for rows.Next() {
			u := models.User{Team: &models.Team{}}
			err := rows.Scan(&u.ID, &u.Name, &u.Username, &u.Team.ID, &u.Team.Name)
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
