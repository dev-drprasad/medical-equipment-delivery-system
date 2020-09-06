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

func GetPatient(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		idStr := params["id"]
		id, err := strconv.ParseUint(idStr, 10, 64)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		p := models.Patient{
			Orders: []*models.Order{},
		}
		rows, err := db.Query("SELECT p.accountId, p.firstName, p.lastName, p.birthDate, p.address, p.zipcode, p.phoneNumber, o.id, o.serviceDate, o.status from `patient` AS p LEFT JOIN `order` AS o on p.accountId = o.orderedBy WHERE p.accountId = ?", &id)
		if err != nil {
			log.Println("Could not query order ", id, " : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		for rows.Next() {
			o := models.Order{}
			err = rows.Scan(&p.AccountID, &p.FirstName, &p.LastName, &p.BirthDate, &p.Address, &p.Zipcode, &p.PhoneNumber, &o.ID, &o.ServiceDate, &o.Status)
			if err != nil {
				log.Println("Could not query patient orders ", id, " : ", err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			if o.ID != nil {
				p.Orders = append(p.Orders, &o)
			}
		}

		b, err := json.Marshal(p)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.Write(b)
	})
}
