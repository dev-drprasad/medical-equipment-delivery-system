package operations

import (
	"encoding/json"
	"log"
	"net/http"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
)

func UpdateOrderStatus(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		dec := json.NewDecoder(r.Body)
		var o models.Order
		if err := dec.Decode(&o); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		result, err := db.Exec("UPDATE `order` SET status = ? WHERE id = ?", o.Status, o.ID)

		if err != nil {
			log.Println("Could not create order : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		rowsAffected, _ := result.RowsAffected()
		if rowsAffected != 1 {
			log.Println("No rows affected")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Add("Content-Type", "application/json")
		w.Write([]byte("{}"))

	})
}
