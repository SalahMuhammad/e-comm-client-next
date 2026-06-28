// Place these keys inside your existing messages JSON files
// e.g. messages/en.json  →  merge at the top level

const maintenanceTranslations = {
  "maintenance": {
    "form": {
      "maintenance":        "Maintenance Record",
      "client":             "Client",
      "item":               "Item",
      "serialNumber":       "Serial Number",
      "malfunctions":       "Reported Malfunctions",
      "malfunctionsPlaceholder": "Describe the issue reported by the client…",
      "dateIn":             "Date In",
      "dateOut":            "Date Out",
      "notes":              "Notes",
      "additionalNotes":    "Additional notes…",
      "spareParts":         "Spare Parts Used",
      "addSparePart":       "Add Spare Part",
      "selectDifferentPart":"Change Part",
      "quantity":           "Quantity",
      "partId":             "Part ID:",
      "notSet":             "—",
      "unknownPart":        "Unknown Part",
      "noPartsYet":         "No spare parts added yet",
      "status": {
        "pending":     "Pending",
        "in_progress": "In Progress",
        "completed":   "Completed",
        "cancelled":   "Cancelled"
      }
    },
    "list": {
      "title":             "Maintenance",
      "all":               "All",
      "new":               "New Record",
      "searchPlaceholder": "Search by client, item or serial…",
      "empty":             "No maintenance records found",
      "emptyHint":         "Create a new record to get started",
      "parts":             "parts",
      "updated":           "Updated",
      "editRecord":        "Edit / Close",
      "showing":           "Showing {from}–{to} of {total}"
    }
  }
};

export default maintenanceTranslations;
