// app/items/list/layout.jsx
export default function ListLayout({ children, modal }) {
    return (
        <div>
            {children}
            {modal}
        </div>
    );
}