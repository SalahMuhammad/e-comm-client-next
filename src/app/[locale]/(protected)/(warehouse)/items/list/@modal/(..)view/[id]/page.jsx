// app/[locale]/(protected)/(warehouse)/items/list/@modal/(..)view/[id]/page.jsx
import Modal from './Modal';
import ItemView from '../../../../view/[id]/ItemView';

export default function InterceptedItemView({ params }) {
    return (
        <Modal>
            <ItemView id={params.id} />
        </Modal>
    );
}