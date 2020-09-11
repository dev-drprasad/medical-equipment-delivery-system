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

func UpdateOrderAppointment(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		idStr := params["id"]
		id, err := strconv.ParseUint(idStr, 10, 64)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		dec := json.NewDecoder(r.Body)
		var o models.Order
		if err := dec.Decode(&o); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		_, err = db.Exec("UPDATE `order` SET appointment = ? WHERE id = ?", o.Appointment, id)

		if err != nil {
			log.Println("Could not update appointment : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Add("Content-Type", "application/json")
		w.Write([]byte("{}"))

	})
}
