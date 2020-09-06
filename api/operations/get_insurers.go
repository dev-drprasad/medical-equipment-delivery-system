package operations

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"reflect"
	"strings"

	"breath-right-one/api/models"

	"github.com/jmoiron/sqlx"
)

func getJSONFieldTags(in interface{}) []string {
	t := reflect.TypeOf(in)

	tags := []string{}
	// Iterate over all available fields and read the tag value
	for i := 0; i < t.NumField(); i++ {
		// Get the field, returns https://golang.org/pkg/reflect/#StructField
		field := t.Field(i)
		// Get the field tag value
		tag := field.Tag.Get("db")
		tags = append(tags, tag)
	}

	return tags
}

func validate(in interface{}, fields []string) bool {
	if len(fields) == 0 {
		return true
	}
	// TypeOf returns the reflection Type that represents the dynamic type of variable.
	// If variable is a nil interface value, TypeOf returns nil.

	tags := getJSONFieldTags(in)
	for _, f := range fields {
		valid := false
		for _, t := range tags {
			if f == t {
				valid = true
			}
		}
		if !valid {
			return false
		}
	}

	return true
}

func validateQueryParams(in interface{}, vs url.Values) bool {
	fieldsStr, sortByField := vs.Get("fields"), vs.Get("sortBy")
	var fields []string
	if fieldsStr != "" {
		fields = strings.Split(fieldsStr, ",")
	}
	if sortByField != "" {
		fields = append(fields, sortByField)
	}
	return validate(in, fields)
}

func GetInsurers(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query()
		valid := validateQueryParams(models.Insurer{}, q)
		if !valid {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		fields := q.Get("fields")
		if fields == "" {
			fields = "*"
		}
		sf, so := "id", "DESC"
		sortByField := q.Get("sortBy")
		if sortByField != "" {
			sf, so = sortByField, "ASC"
		}

		insurers := []models.Insurer{}
		err := db.Select(&insurers, fmt.Sprintf("SELECT %s FROM insurer ORDER BY %s %s", fields, sf, so))
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		b, err := json.Marshal(insurers)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Add("Content-Type", "application/json")
		w.Write(b)
	})
}
