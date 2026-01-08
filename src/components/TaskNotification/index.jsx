import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './tasknotification.module.css'
import { UserContext } from '../../context/UserContext'
import supabase from '../../helper/superBaseClient'
import { FaTasks, FaBell, FaTimes, FaArrowRight, FaCheckCircle } from 'react-icons/fa'

const STORAGE_KEY = 'pendingTaskNotification'
const STORAGE_KEY_COMPLETED = 'completedTaskNotification'

const TaskNotification = () => {
  const { operatorData } = useContext(UserContext)
  const navigate = useNavigate()
  const [notification, setNotification] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [hasNewTask, setHasNewTask] = useState(false)
  const [notificationType, setNotificationType] = useState('new') // 'new' ou 'completed'
  const timeoutRef = useRef(null)
  const subscriptionRef = useRef(null)

  // Verificar tipo de usuário
  const isAdmin = operatorData?.operator_type === 'Admin'
  const currentOperatorId = operatorData?.operator_code_id

  // Carregar notificação persistida ao iniciar
  useEffect(() => {
    // Carregar notificação de nova tarefa (para admin)
    if (isAdmin) {
      const savedNotification = localStorage.getItem(STORAGE_KEY)
      if (savedNotification) {
        try {
          const parsed = JSON.parse(savedNotification)
          setNotification(parsed)
          setIsVisible(true)
          setIsMinimized(true)
          setHasNewTask(true)
          setNotificationType('new')
        } catch (e) {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    }

    // Carregar notificação de tarefa concluída (para operadores)
    if (currentOperatorId) {
      const savedCompletedNotification = localStorage.getItem(STORAGE_KEY_COMPLETED)
      if (savedCompletedNotification) {
        try {
          const parsed = JSON.parse(savedCompletedNotification)
          // Verificar se a notificação é para o operador atual
          if (parsed.operatorRequiredId === currentOperatorId) {
            setNotification(parsed)
            setIsVisible(true)
            setIsMinimized(true)
            setHasNewTask(true)
            setNotificationType('completed')
          }
        } catch (e) {
          localStorage.removeItem(STORAGE_KEY_COMPLETED)
        }
      }
    }
  }, [isAdmin, currentOperatorId])

  useEffect(() => {
    if (!currentOperatorId) return

    let insertChannel = null
    let updateChannel = null

    // Configurar subscription do Supabase Realtime para INSERT (apenas para admins)
    if (isAdmin) {
      insertChannel = supabase
        .channel('task_manager_insert')
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

            // Salvar no localStorage para persistir entre navegações
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotification))

            setNotification(newNotification)
            setIsVisible(true)
            setIsMinimized(false)
            setHasNewTask(true)
            setNotificationType('new')

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
    }

    // Configurar subscription para UPDATE
    updateChannel = supabase
      .channel('task_manager_update_notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'task_manager'
        },
        async (payload) => {
          const oldStatus = payload.old?.status
          const newStatus = payload.new?.status
          const taskId = payload.new?.id
          const operatorRequiredId = payload.new?.operator_required

          // Para admins: remover notificação quando status mudar de pendente
          if (isAdmin && oldStatus === 'pendente' && newStatus !== 'pendente') {
            const savedNotification = localStorage.getItem(STORAGE_KEY)
            if (savedNotification) {
              try {
                const parsed = JSON.parse(savedNotification)
                if (parsed.id === taskId) {
                  localStorage.removeItem(STORAGE_KEY)
                  setIsVisible(false)
                  setIsMinimized(true)
                  setHasNewTask(false)
                  setNotification(null)
                }
              } catch (e) {
                // Erro ao parsear, ignorar
              }
            }
          }

          // Para operadores: notificar quando sua tarefa for concluída
          if (newStatus === 'concluido' && operatorRequiredId === currentOperatorId) {
            // Buscar informações do admin que concluiu a tarefa
            const { data: adminInfo } = await supabase
              .from('operator')
              .select('operator_name')
              .eq('operator_code_id', payload.new.operator_activity_conclude)
              .single()

            const completedNotification = {
              id: taskId,
              reason: payload.new.reason || 'Tarefa concluída',
              adminReason: payload.new.admin_reason || '',
              operatorName: adminInfo?.operator_name || 'Administrador',
              operatorRequiredId: operatorRequiredId,
              createdAt: new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })
            }

            // Salvar no localStorage para persistir entre navegações
            localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completedNotification))

            setNotification(completedNotification)
            setIsVisible(true)
            setIsMinimized(false)
            setHasNewTask(true)
            setNotificationType('completed')

            // Limpar timeout anterior se existir
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
            }

            // Esconder após 3 segundos
            timeoutRef.current = setTimeout(() => {
              setIsMinimized(true)
            }, 3000)
          }
        }
      )
      .subscribe()

    subscriptionRef.current = { insertChannel, updateChannel }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (subscriptionRef.current) {
        if (subscriptionRef.current.insertChannel) {
          supabase.removeChannel(subscriptionRef.current.insertChannel)
        }
        if (subscriptionRef.current.updateChannel) {
          supabase.removeChannel(subscriptionRef.current.updateChannel)
        }
      }
    }
  }, [isAdmin, currentOperatorId])

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
  }

  const handleViewTasks = () => {
    // Remover do localStorage dependendo do tipo de notificação
    if (notificationType === 'new') {
      localStorage.removeItem(STORAGE_KEY)
      navigate('/tasks')
    } else {
      localStorage.removeItem(STORAGE_KEY_COMPLETED)
      navigate('/mytasks')
    }
    
    setIsMinimized(true)
    setIsVisible(false)
    setHasNewTask(false)
    setNotification(null)
  }

  // Não renderizar se não tiver notificação
  if (!isVisible) return null

  const isCompletedNotification = notificationType === 'completed'

  return (
    <div className={styles.notificationContainer}>
      {/* Botão minimizado */}
      {isMinimized && (
        <button 
          className={`${styles.minimizedBtn} ${hasNewTask ? styles.hasNew : ''} ${isCompletedNotification ? styles.completedBtn : ''}`}
          onClick={handleShowNotification}
          title={isCompletedNotification ? "Ver notificação de tarefa concluída" : "Ver notificação de tarefa"}
        >
          {isCompletedNotification ? <FaCheckCircle /> : <FaBell />}
          {hasNewTask && <span className={`${styles.dot} ${isCompletedNotification ? styles.dotCompleted : ''}`}></span>}
        </button>
      )}

      {/* Notificação expandida */}
      {!isMinimized && notification && (
        <div className={`${styles.notification} ${isCompletedNotification ? styles.notificationCompleted : ''}`}>
          <div className={`${styles.notificationHeader} ${isCompletedNotification ? styles.headerCompleted : ''}`}>
            <div className={`${styles.notificationTitle} ${isCompletedNotification ? styles.titleCompleted : ''}`}>
              {isCompletedNotification ? <FaCheckCircle className={styles.icon} /> : <FaTasks className={styles.icon} />}
              <span>{isCompletedNotification ? 'Tarefa Concluída' : 'Nova Tarefa'}</span>
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
            {isCompletedNotification && notification.adminReason && (
              <p className={styles.adminReason}>
                <strong>Resultado:</strong> {notification.adminReason.length > 40 
                  ? notification.adminReason.substring(0, 40) + '...' 
                  : notification.adminReason}
              </p>
            )}
            <div className={styles.taskMeta}>
              <span className={`${styles.operatorName} ${isCompletedNotification ? styles.operatorNameCompleted : ''}`}>
                {isCompletedNotification ? `Por: ${notification.operatorName}` : notification.operatorName}
              </span>
              <span className={styles.time}>
                {notification.createdAt}
              </span>
            </div>
          </div>

          <div className={styles.notificationFooter}>
            <button 
              className={`${styles.viewTasksBtn} ${isCompletedNotification ? styles.viewTasksBtnCompleted : ''}`}
              onClick={handleViewTasks}
            >
              {isCompletedNotification ? 'Ver Minhas Solicitações' : 'Ver Tarefas'} <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskNotification

