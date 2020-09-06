package operations

import (
	"encoding/json"
	"log"
	"net/http"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
)

func GetOrderStatuses(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var statuses []models.OrderStatus
		for k, v := range models.OrderStatusValueToName {
			statuses = append(statuses, models.OrderStatus{ID: k, Name: v})
		}

		b, err := json.Marshal(statuses)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.Write(b)
	})
}
