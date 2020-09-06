package operations

import (
	"encoding/json"
	"log"
	"net/http"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
)

func GetOrders(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		rows, err := db.Query("select o.id, o.status, o.serviceDate, p.accountId, p.firstName, p.lastName, p.phoneNumber, i.id, i.name, h.id, h.name from `order` as o left join `patient` as p on o.orderedBy = p.accountId left join `insurer` as i on o.insuredBy = i.id left join `physician` as h on o.prescribedBy = h.id WHERE o.id")
		if err != nil {
			log.Println("Could not query orders", " : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		var orders []models.Order
		for rows.Next() {
			o := models.Order{
				OrderedBy:    &models.Patient{},
				InsuredBy:    &models.Insurer{},
				PrescribedBy: &models.Physician{},
			}
			err = rows.Scan(&o.ID, &o.Status, &o.ServiceDate, &o.OrderedBy.AccountID, &o.OrderedBy.FirstName, &o.OrderedBy.LastName, &o.OrderedBy.PhoneNumber, &o.InsuredBy.ID, &o.InsuredBy.Name, &o.PrescribedBy.ID, &o.PrescribedBy.Name)
			if err != nil {
				log.Println("Could not query order", " : ", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			orders = append(orders, o)
		}

		b, err := json.Marshal(orders)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.Write(b)
	})
}
