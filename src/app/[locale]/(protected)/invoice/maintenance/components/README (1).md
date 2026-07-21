# Maintenance Module

## Files

| File | Purpose |
|------|---------|
| `MaintenanceForm.jsx` | Create (POST) and Edit/Close (PUT) form |
| `MaintenanceList.jsx` | Paginated, filterable list with status tabs |
| `MaintenanceView.jsx` | Read-only detail view with quick-close action |
| `actions.js`         | Server action wired to `useActionState` |
| `translations.js`    | i18n keys — merge into your messages JSON |

---

## Routing (App Router)

```
app/
  maintenance/
    create/
      page.jsx          ← <MaintenanceForm />
    edit/[hashed_id]/
      page.jsx          ← <MaintenanceForm initialData={record} />
    view/[hashed_id]/
      page.jsx          ← <MaintenanceView /> (see view-page.jsx)
    page.jsx            ← <MaintenanceList initialData={serverSidePage} />
```

### create/page.jsx
```jsx
import MaintenanceForm from '@/components/maintenance/MaintenanceForm';
export default function CreatePage() {
  return <MaintenanceForm />;
}
```

### edit/[hashed_id]/page.jsx
```jsx
import MaintenanceForm from '@/components/maintenance/MaintenanceForm';

export default async function EditPage({ params }) {
  const res    = await fetch(`/api/maintenance/${params.hashed_id}/`, { cache: 'no-store' });
  const record = await res.json();
  return <MaintenanceForm initialData={record} />;
}
```

### view/[hashed_id]/page.jsx
```jsx
import MaintenanceView from '@/components/maintenance/MaintenanceView';

export default async function MaintenanceViewPage({ params }) {
  const res = await fetch(`/api/maintenance/${params.hashed_id}/`, { cache: 'no-store' });
  if (!res.ok) return <MaintenanceView data={null} />;
  const data = await res.json();
  return <MaintenanceView data={data} />;
}
```

### page.jsx (list)
```jsx
import MaintenanceList from '@/components/maintenance/MaintenanceList';

export default async function ListPage({ searchParams }) {
  const params = new URLSearchParams(searchParams);
  const res    = await fetch(`/api/maintenance/?${params}`, { cache: 'no-store' });
  const data   = await res.json();
  return <MaintenanceList initialData={data} />;
}
```

---

## API mapping

| Action | HTTP | Payload |
|--------|------|---------|
| Create | POST `/api/maintenance/` | `client`, `item`, `serial_number`, `malfunctions`, `notes`, `parts[]` |
| Update | PUT  `/api/maintenance/{id}/` | `date_out`, `notes`, `parts[]` |
| List   | GET  `/api/maintenance/` | `search`, `status`, `page`, `page_size` |

### Parts shape
```json
{ "spare_part": 10, "quantity": 2 }
```

---

## i18n

Merge `translations.js` export into your `messages/en.json` (and other locales):

```json
{
  "maintenance": {
    "form": { ... },
    "list": { ... }
  }
}
```

---

## Spare-parts API

The form calls `/api/spare-parts/?name=` for the dynamic select.
Adjust to your actual endpoint if different (e.g. `/api/inventory/spare-parts/?s=`).

---

## CSS

`MaintenanceForm` imports `../invoice/form.module.css` — the same stylesheet used
by `InvoiceForm`. If you move files, update the relative import path.
