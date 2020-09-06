package operations

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"breath-right-one/api/models"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

func GetCommentsByOrderID(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		idStr := params["id"]
		id, err := strconv.ParseUint(idStr, 10, 64)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		rows, err := db.Query("SELECT comment.id,content,unix_timestamp(createdAt),user.id,user.name FROM comment LEFT JOIN user ON comment.userId = user.id WHERE comment.orderId = ?", id)
		if err != nil {
			log.Println("Could not query order ", id, " : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		comments := make([]models.Comment, 0)
		for rows.Next() {
			c := models.Comment{User: &models.User{}}
			err := rows.Scan(&c.ID, &c.Content, &c.CreatedAt, &c.User.ID, &c.User.Name)
			c.CreatedAt = c.CreatedAt * 1000
			if err != nil {
				log.Println(err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			comments = append(comments, c)
		}

		b, err := json.Marshal(comments)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.Write(b)

	})
}
