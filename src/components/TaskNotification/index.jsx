import React, { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './tasknotification.module.css'
import { UserContext } from '../../context/UserContext'
import supabase from '../../helper/superBaseClient'
import { FaTasks, FaBell, FaTimes, FaArrowRight } from 'react-icons/fa'

const STORAGE_KEY = 'pendingTaskNotification'

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

  // Carregar notificação persistida ao iniciar
  useEffect(() => {
    if (!isAdmin) return

    const savedNotification = localStorage.getItem(STORAGE_KEY)
    if (savedNotification) {
      try {
        const parsed = JSON.parse(savedNotification)
        setNotification(parsed)
        setIsVisible(true)
        setIsMinimized(true)
        setHasNewTask(true)
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [isAdmin])

  useEffect(() => {
    if (!isAdmin) return

    // Configurar subscription do Supabase Realtime para INSERT
    const insertChannel = supabase
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

    // Configurar subscription para UPDATE - remover notificação quando status mudar de pendente
    const updateChannel = supabase
      .channel('task_manager_update')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'task_manager'
        },
        (payload) => {
          // Verificar se o status mudou de 'pendente' para outro
          const oldStatus = payload.old?.status
          const newStatus = payload.new?.status
          const taskId = payload.new?.id

          if (oldStatus === 'pendente' && newStatus !== 'pendente') {
            // Verificar se é a tarefa da notificação atual
            const savedNotification = localStorage.getItem(STORAGE_KEY)
            if (savedNotification) {
              try {
                const parsed = JSON.parse(savedNotification)
                if (parsed.id === taskId) {
                  // Remover notificação
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
        }
      )
      .subscribe()

    subscriptionRef.current = { insertChannel, updateChannel }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current.insertChannel)
        supabase.removeChannel(subscriptionRef.current.updateChannel)
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
  }

  const handleViewTasks = () => {
    // Remover do localStorage ao clicar em Ver Tarefas
    localStorage.removeItem(STORAGE_KEY)
    
    setIsMinimized(true)
    setIsVisible(false)
    setHasNewTask(false)
    setNotification(null)
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

