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

func GetOrder(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		idStr := params["id"]
		id, err := strconv.ParseUint(idStr, 10, 64)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		o := models.Order{
			OrderedBy:    &models.Patient{},
			InsuredBy:    &models.Insurer{},
			PrescribedBy: &models.Physician{},
			Equipments:   []*models.Equipment{},
		}
		rows, err := db.Query("select o.id, o.status, o.serviceDate, o.appointment, p.accountId, p.firstName, p.lastName, p.phoneNumber, i.id, i.name, h.id, h.name, equipment.id, equipment.name, equipment.code, equipment.setPrice from `order` as o left join `patient` as p on o.orderedBy = p.accountId left join `insurer` as i on o.insuredBy = i.id left join `physician` as h on o.prescribedBy = h.id left join order_equipment ON order_equipment.orderId = o.id LEFT JOIN equipment ON order_equipment.equipmentId = equipment.id WHERE o.id = ?", &id)
		if err != nil {
			log.Println("Could not query order ", id, " : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		for rows.Next() {
			e := models.Equipment{}
			err = rows.Scan(&o.ID, &o.Status, &o.ServiceDate, &o.Appointment, &o.OrderedBy.AccountID, &o.OrderedBy.FirstName, &o.OrderedBy.LastName, &o.OrderedBy.PhoneNumber, &o.InsuredBy.ID, &o.InsuredBy.Name, &o.PrescribedBy.ID, &o.PrescribedBy.Name, &e.ID, &e.Name, &e.Code, &e.SetPrice)
			if err != nil {
				log.Println("Could not query order ", id, " : ", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			if e.ID != nil {
				o.Equipments = append(o.Equipments, &e)
			}
		}

		b, err := json.Marshal(o)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.Write(b)
	})
}
