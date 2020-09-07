package operations

import (
	"breath-right-one/api/models"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

func UpdateOrderEquipments(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		idStr := params["id"]
		id, err := strconv.ParseUint(idStr, 10, 64)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		dec := json.NewDecoder(r.Body)
		var equipmentIDs []uint64
		if err := dec.Decode(&equipmentIDs); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		oe := []models.OrderEquipment{}
		for _, eID := range equipmentIDs {
			oe = append(oe, models.OrderEquipment{EquipmentID: eID, OrderID: id})
		}

		_, err = db.Exec("DELETE FROM order_equipment WHERE orderId = ?", id)
		if err != nil {
			log.Println("Could not update order : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if len(oe) == 0 {
			w.WriteHeader(http.StatusOK)
			w.Header().Add("Content-Type", "application/json")
			w.Write([]byte("{}"))
			return
		}
		_, err = db.NamedExec("INSERT INTO order_equipment(orderId, equipmentId) VALUES(:orderId,:equipmentId)", oe)

		if err != nil {
			log.Println("Could not update order : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Add("Content-Type", "application/json")
		w.Write([]byte("{}"))

	})
}
