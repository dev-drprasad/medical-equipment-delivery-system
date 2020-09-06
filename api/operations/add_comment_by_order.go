package operations

import (
	"encoding/json"
	"log"
	"net/http"

	"breath-right-one/api/models"

	"github.com/gorilla/context"
	"github.com/jmoiron/sqlx"
)

func AddCommentByOrderID(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		dec := json.NewDecoder(r.Body)
		var c models.Comment
		if err := dec.Decode(&c); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		c.UserID = uint64(context.Get(r, "userId").(float64))

		result, err := db.Exec("INSERT INTO comment(content, userId, orderId) VALUES(?, ?, ?)", &c.Content, &c.UserID, &c.OrderID)

		if err != nil {
			log.Println("Could not add comment : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		lastInsertedID, _ := result.LastInsertId()
		if lastInsertedID == 0 {
			log.Println("No rows affected")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		lc := models.Comment{User: &models.User{}}
		err = db.QueryRow("SELECT comment.id,UNIX_TIMESTAMP(comment.createdAt),content,userId,user.name FROM comment LEFT JOIN user ON user.id = comment.userId WHERE comment.id = ?", lastInsertedID).
			Scan(&lc.ID, &lc.CreatedAt, &lc.Content, &lc.User.ID, &lc.User.Name)

		lc.CreatedAt = lc.CreatedAt * 1000

		if err != nil {
			log.Println("Could not get row by last inserted id ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		b, err := json.Marshal(lc)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Add("Content-Type", "application/json")
		w.Write(b)

	})
}
