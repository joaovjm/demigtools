import { useEffect } from "react"
import "./index.css"

export const ModalConfirm = ({isOpen, onClose, onConfirm, title, message}) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape"){
                onClose();
            }
            if (e.keyCode === 89) {
                onConfirm()
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
                <h4>{title}</h4>
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-button">Cancelar</button>
                    <button onClick={onConfirm} className="confirm-button">Confirmar</button>
                </div>
            </div>
        </div>
    )
  
}