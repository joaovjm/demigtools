import React, { useState, useContext } from 'react'
import styles from './modalcreatetask.module.css'
import supabase from '../../helper/superBaseClient'
import { toast } from 'react-toastify'
import { UserContext } from '../../context/UserContext'
import { FaTasks, FaUser, FaReceipt, FaSpinner, FaPaperPlane, FaTimes } from 'react-icons/fa'

const ModalCreateTask = ({ isOpen, onClose, donorId, donorName }) => {
  const { operatorData } = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [taskType, setTaskType] = useState('doador') // 'doador' or 'recibo'
  const [reason, setReason] = useState('')
  const [receiptId, setReceiptId] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!reason.trim()) {
      toast.warning('Por favor, descreva a tarefa')
      return
    }

    if (taskType === 'recibo' && !receiptId.trim()) {
      toast.warning('Por favor, informe o número do recibo')
      return
    }

    try {
      setLoading(true)

      const taskData = {
        reason: reason.trim(),
        operator_required: operatorData?.operator_code_id,
        status: 'pendente',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      if (taskType === 'doador') {
        taskData.donor_id = donorId
      } else if (taskType === 'recibo') {
        taskData.receipt_donation_id = parseInt(receiptId)
      }

      const { error } = await supabase
        .from('task_manager')
        .insert([taskData])

      if (error) throw error

      toast.success('Tarefa criada com sucesso!')
      setReason('')
      setReceiptId('')
      setTaskType('doador')
      onClose()
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
      toast.error('Erro ao criar tarefa')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <main className={styles.modalContainer}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>
                <FaTasks /> Nova Tarefa
              </h2>
            </div>
            <button onClick={onClose} className={styles.btnCloseModal} title="Fechar">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.modalBody}>
              <div className={styles.formSection}>
                <h3>Informações da Tarefa</h3>
                
                <div className={styles.formGrid}>
                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>Descrição da Tarefa *</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Descreva o que precisa ser feito..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Tipo de Referência *</label>
                    <select
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value)}
                    >
                      <option value="doador">Doador</option>
                      <option value="recibo">Recibo</option>
                    </select>
                  </div>

                  {taskType === 'doador' && (
                    <div className={styles.inputGroup}>
                      <label>Doador</label>
                      <div className={styles.referenceInfo}>
                        <FaUser className={styles.referenceIcon} />
                        <span>{donorName || `ID: ${donorId}`}</span>
                      </div>
                    </div>
                  )}

                  {taskType === 'recibo' && (
                    <div className={styles.inputGroup}>
                      <label>Número do Recibo *</label>
                      <input
                        type="number"
                        value={receiptId}
                        onChange={(e) => setReceiptId(e.target.value)}
                        placeholder="Digite o número do recibo..."
                        required
                      />
                    </div>
                  )}

                  <div className={styles.inputGroup}>
                    <label>Solicitante</label>
                    <div className={styles.referenceInfo}>
                      <FaUser className={styles.referenceIcon} />
                      <span>{operatorData?.operator_name || 'Operador'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.infoBox}>
                <p>
                  <strong>Atenção:</strong> Após criar a tarefa, o administrador será notificado 
                  e poderá visualizar todos os detalhes. Você poderá acompanhar o status da 
                  sua solicitação na página "Minhas Tarefas".
                </p>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" onClick={onClose} className={styles.btnClose}>
                <FaTimes /> Cancelar
              </button>
              <button type="submit" disabled={loading} className={styles.btnConfirm}>
                {loading ? (
                  <>
                    <FaSpinner className={styles.spinner} /> Criando...
                  </>
                ) : (
                  <>
                    <FaPaperPlane /> Criar Tarefa
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default ModalCreateTask

