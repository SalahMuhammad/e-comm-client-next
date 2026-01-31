// app/[locale]/(protected)/(warehouse)/items/list/@modal/(..)view/[id]/page.jsx
import Modal from './Modal';
import ItemView from '../../../../view/[id]/ItemView';

export default async function InterceptedItemView({ params }) {
    const { id } = await params;
    return (
        <Modal>
            <ItemView id={id} />
        </Modal>
    );
}