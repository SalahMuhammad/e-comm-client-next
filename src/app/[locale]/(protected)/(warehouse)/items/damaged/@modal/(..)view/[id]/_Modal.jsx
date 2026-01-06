'use client';

import { ElementRef, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

export function Modal({ children }) {
    const router = useRouter();
    const dialogRef = useRef < ElementRef < 'dialog' >> (null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }, []);

    function onDismiss() {
        router.back();
    }

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) throw new Error("modal-root not found");
    return createPortal(
        <div className="modal-backdrop">
            <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
                {children}
                <button onClick={onDismiss} className="close-button" />
            </dialog>
        </div>,
        modalRoot
    );
}



//   return createPortal(
//     <div className="modal-backdrop">
//       <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
//         {children}
//         <button onClick={onDismiss} className="close-button" />
//       </dialog>
//     </div>,
//     document.getElementById('modal-root')!
//   );