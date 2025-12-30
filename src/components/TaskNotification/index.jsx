import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './tasknotification.module.css'
import { UserContext } from '../../context/UserContext'
import supabase from '../../helper/superBaseClient'
import { FaTasks, FaBell, FaTimes, FaArrowRight } from 'react-icons/fa'

const TaskNotification = () => {
  const { operatorData } = useContext(UserContext)
  const navigate = useNavigate()
  const [notification, setNotification] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [hasNewTask, setHasNewTask] = useState(false)
  const timeoutRef = useRef(null)
  const subscriptionRef = useRef(null)

  // Só exibir para administradores
  const isAdmin = operatorData?.operator_type === 'Admin'

  useEffect(() => {
    if (!isAdmin) return

    // Configurar subscription do Supabase Realtime
    const channel = supabase
      .channel('task_manager_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'task_manager'
        },
        async (payload) => {
          // Buscar informações do operador que criou a tarefa
          const { data: operatorInfo } = await supabase
            .from('operator')
            .select('operator_name')
            .eq('operator_code_id', payload.new.operator_required)
            .single()

          const newNotification = {
            id: payload.new.id,
            reason: payload.new.reason || 'Nova tarefa',
            operatorName: operatorInfo?.operator_name || 'Operador',
            createdAt: new Date().toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            })
          }

          setNotification(newNotification)
          setIsVisible(true)
          setIsMinimized(false)
          setHasNewTask(true)

          // Limpar timeout anterior se existir
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }

          // Esconder após 3 segundos
          timeoutRef.current = setTimeout(() => {
            setIsMinimized(true)
          }, 3000)
        }
      )
      .subscribe()

    subscriptionRef.current = channel

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
      }
    }
  }, [isAdmin])

  const handleShowNotification = () => {
    setIsMinimized(false)
    setHasNewTask(false)

    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Esconder após 3 segundos
    timeoutRef.current = setTimeout(() => {
      setIsMinimized(true)
    }, 3000)
  }

  const handleClose = () => {
    setIsMinimized(true)
    setHasNewTask(false)
  }

  const handleViewTasks = () => {
    setIsMinimized(true)
    setIsVisible(false)
    setHasNewTask(false)
    navigate('/tasks')
  }

  // Não renderizar se não for admin ou não tiver notificação
  if (!isAdmin || !isVisible) return null

  return (
    <div className={styles.notificationContainer}>
      {/* Botão minimizado */}
      {isMinimized && (
        <button 
          className={`${styles.minimizedBtn} ${hasNewTask ? styles.hasNew : ''}`}
          onClick={handleShowNotification}
          title="Ver notificação de tarefa"
        >
          <FaBell />
          {hasNewTask && <span className={styles.dot}></span>}
        </button>
      )}

      {/* Notificação expandida */}
      {!isMinimized && notification && (
        <div className={styles.notification}>
          <div className={styles.notificationHeader}>
            <div className={styles.notificationTitle}>
              <FaTasks className={styles.icon} />
              <span>Nova Tarefa</span>
            </div>
            <button 
              className={styles.closeBtn}
              onClick={handleClose}
              title="Fechar"
            >
              <FaTimes />
            </button>
          </div>

          <div className={styles.notificationBody}>
            <p className={styles.taskReason}>
              {notification.reason.length > 50 
                ? notification.reason.substring(0, 50) + '...' 
                : notification.reason}
            </p>
            <div className={styles.taskMeta}>
              <span className={styles.operatorName}>
                {notification.operatorName}
              </span>
              <span className={styles.time}>
                {notification.createdAt}
              </span>
            </div>
          </div>

          <div className={styles.notificationFooter}>
            <button 
              className={styles.viewTasksBtn}
              onClick={handleViewTasks}
            >
              Ver Tarefas <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskNotification

