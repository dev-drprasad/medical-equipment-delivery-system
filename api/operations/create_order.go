package operations

import (
	"encoding/json"
	"log"
	"net/http"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
)

func CreateOrder(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		dec := json.NewDecoder(r.Body)
		var o models.Order
		if err := dec.Decode(&o); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if len(o.EquipmentIDs) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		tx, err := db.Beginx()
		if err != nil {
			log.Println("Could not start transaction : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		res, err := tx.Exec("INSERT INTO `order`(status, serviceDate, orderedBy, prescribedBy, insuredBy) VALUES(?, ?, ?, ?, ?)", &o.Status, &o.ServiceDate, &o.OrderedByID, &o.PrescribedByID, &o.InsuredByID)
		if err != nil {
			log.Println(err)
			tx.Rollback()
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		lastInsertedID, err := res.LastInsertId()
		if err != nil {
			log.Println("Could not get last insertedId : ", err)
			tx.Rollback()
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		oe := []models.OrderEquipment{}
		for _, i := range o.EquipmentIDs {
			oe = append(oe, models.OrderEquipment{OrderID: uint64(lastInsertedID), EquipmentID: i})
		}
		log.Println(oe)

		res, err = tx.NamedExec("INSERT INTO order_equipment(orderId, equipmentId) VALUES (:orderId, :equipmentId)", oe)
		if err != nil {
			log.Println("Could not insert order equipment : ", err)
			tx.Rollback()
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		osu := []models.OrderSalesUser{}
		for _, i := range o.SaledByIDs {
			osu = append(osu, models.OrderSalesUser{OrderID: uint64(lastInsertedID), UserID: i})
		}
		res, err = tx.NamedExec("INSERT INTO order_sale_user(orderId, userId) VALUES (:orderId, :userId)", osu)
		if err != nil {
			log.Println("Could not insert order equipment : ", err)
			tx.Rollback()
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		// commit the transaction
		if err := tx.Commit(); err != nil {
			log.Println("Could not commit transaction : ", err)
			tx.Rollback()
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Add("Content-Type", "application/json")
		w.Write([]byte("{}"))

	})
}
