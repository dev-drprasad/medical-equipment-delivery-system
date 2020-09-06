package models

import "gopkg.in/guregu/null.v3"

type StatusID string

const (
	StatusInit      StatusID = "Init"
	StatusVerified  StatusID = "Verified"
	StatusCanceled  StatusID = "Canceled"
	StatusDelivered StatusID = "Delivered"
)

type OrderStatus struct {
	ID   StatusID `json:"id"`
	Name string   `json:"name"`
}

var OrderStatusValueToName = map[StatusID]string{StatusInit: "Init", StatusVerified: "Verified", StatusCanceled: "Canceled", StatusDelivered: "Delivered"}
var OrderStatusNameToValue = map[string]StatusID{"Init": StatusInit, "Verified": StatusVerified, "Canceled": StatusCanceled, "Delivered": StatusDelivered}

type Order struct {
	ID             uint64      `json:"id" db:"id"`
	ServiceDate    null.String `json:"serviceDate" db:"serviceDate"`
	Status         string      `json:"status" db:"status"`
	OrderedByID    uint64      `json:"orderedById,omitempty" db:"orderedBy"`
	PrescribedByID uint64      `json:"prescribedById,omitempty" db:"prescribedBy"`
	InsuredByID    uint        `json:"insuredById,omitempty" db:"insuredBy"`
	Appointment    null.String `json:"appointment" db:"appointment"`

	EquipmentIDs []uint64     `json:"equipmentIds" db:"-"`
	SaledByIDs   []uint64     `json:"saledByIds" db:"-"`
	OrderedBy    *Patient     `json:"orderedBy"`
	PrescribedBy *Physician   `json:"prescribedBy"`
	InsuredBy    *Insurer     `json:"insuredBy"`
	Equipments   []*Equipment `json:"equipments" db:"-"`
	SaledBy      []*User      `json:"saledBy" db:"-"`
	Documents    []*Document  `json:"documents" db:"documents"`
}

type OrderEquipment struct {
	OrderID     uint64 `json:"orderId" db:"orderId"`
	EquipmentID uint64 `json:"equipmentId" db:"equipmentId"`
}

type OrderSalesUser struct {
	OrderID uint64 `json:"orderId" db:"orderId"`
	UserID  uint64 `json:"userId" db:"userId"`
}
