package operations

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/context"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

func UploadOrderDocument(db *sqlx.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := uint64(context.Get(r, "userId").(float64))
		params := mux.Vars(r)
		idStr := params["id"]
		id, err := strconv.ParseUint(idStr, 10, 64)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		// Parse our multipart form, 10 << 20 specifies a maximum
		// upload of 10 MB files.
		err = r.ParseMultipartForm(10 << 20)
		if err != nil {
			log.Println("Error parsing multipart : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		// FormFile returns the first file for the given key `myFile`
		// it also returns the FileHeader so we can get the Filename,
		// the Header and the size of the file
		file, handler, err := r.FormFile("file")
		if err != nil {
			log.Println("Error Retrieving the File : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer file.Close()
		log.Printf("Uploaded File: %+v\n", handler.Filename)
		log.Printf("File Size: %+v\n", handler.Size)
		log.Printf("MIME Header: %+v\n", handler.Header)

		// Create a temporary file within our temp-images directory that follows
		// a particular naming pattern
		dir := fmt.Sprintf("document/%d", id)
		fpath := fmt.Sprintf("%s/%d-%s", dir, time.Now().Unix(), handler.Filename)
		_ = os.MkdirAll(dir, os.ModePerm)
		ofile, err := os.OpenFile(fpath, os.O_CREATE|os.O_WRONLY, 0644)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer ofile.Close()

		// read all of the contents of our uploaded file into a
		// byte array
		fileBytes, err := ioutil.ReadAll(file)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		// write this byte array to our temporary file
		_, err = ofile.Write(fileBytes)
		if err != nil {
			log.Println("Write failed : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		_, err = db.Exec(`INSERT INTO document(name, path, orderId, createdBy) VALUES(?, ?, ?, ?)`, &handler.Filename, &fpath, &id, &userID)
		if err != nil {
			log.Println("Insert failed : ", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		w.Header().Add("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("{}"))

	})
}
