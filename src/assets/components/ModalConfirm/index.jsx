import { useEffect } from "react"
import "./index.css"

export const ModalConfirm = ({isOpen, onClose, onConfirm, title, message}) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'enter'){
                onclose();
            }
        }
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
    
        return () => {removeEventListener("keydown", handleKeyDown)}
    }, [isOpen, onClose]);

    if(!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-button">Cancelar</button>
                    <button onClick={onConfirm} className="confirm-button">Confirmar</button>
                </div>
            </div>
        </div>
    )
  
}