import React, { useState, useEffect, useContext } from 'react'
import styles from './tasks.module.css'
import supabase from '../../helper/superBaseClient'
import { toast } from 'react-toastify'
import { UserContext } from '../../context/UserContext'
import { FaTasks, FaUser, FaReceipt, FaSpinner, FaFilter, FaSearch } from 'react-icons/fa'
import ModalTaskDetails from '../../components/ModalTaskDetails'

const Tasks = () => {
  const { operatorData } = useContext(UserContext)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingTaskId, setUpdatingTaskId] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const statusOptions = [
    { value: 'pendente', label: 'Pendente', color: '#faa01c' },
    { value: 'em_andamento', label: 'Em Andamento', color: '#385bad' },
    { value: 'concluido', label: 'Concluído', color: '#28a745' },
    { value: 'cancelado', label: 'Cancelado', color: '#c70000' }
  ]

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('task_manager')
        .select(`
          *,
          operator_required_info:operator_required(operator_name, operator_code_id),
          operator_conclude_info:operator_activity_conclude(operator_name, operator_code_id),
          donor:donor_id(donor_id, donor_name, donor_address, donor_city, donor_neighborhood, donor_tel_1),
          donation:receipt_donation_id(
            receipt_donation_id,
            donation_value,
            donation_day_to_receive,
            donation_received,
            donation_print,
            collector_code_id,
            operator_code_id,
            donation_description,
            donor_id
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error)
      toast.error('Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setUpdatingTaskId(taskId)
      const updateData = {
        status: newStatus,
        updated_at: new Date().toISOString()
      }

      // Se estiver marcando como em andamento ou concluído, registrar o admin que fez
      if (newStatus === 'em_andamento' || newStatus === 'concluido') {
        updateData.operator_activity_conclude = operatorData?.operator_code_id
      }

      const { error } = await supabase
        .from('task_manager')
        .update(updateData)
        .eq('id', taskId)

      if (error) throw error

      toast.success('Status atualizado com sucesso!')
      fetchTasks()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    } finally {
      setUpdatingTaskId(null)
    }
  }

  const handleOpenDetails = (task) => {
    setSelectedTask(task)
    setShowModal(true)
  }

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(s => s.value === status)
    return statusOption?.color || '#666'
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesSearch = searchTerm === '' || 
      task.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.operator_required_info?.operator_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.donor?.donor_name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return (
      <div className={styles.tasksContainer}>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.spinner} />
          <p>Carregando tarefas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.tasksContainer}>
      <header className={styles.header}>
        <h1><FaTasks /> Gerenciador de Tarefas</h1>
        <p className={styles.subtitle}>Gerencie as solicitações dos operadores</p>
      </header>

      <div className={styles.filtersContainer}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por tarefa, operador ou doador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterBox}>
          <FaFilter className={styles.filterIcon} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todos os Status</option>
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{tasks.length}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.statCard} style={{ borderColor: '#faa01c' }}>
          <span className={styles.statNumber} style={{ color: '#faa01c' }}>
            {tasks.filter(t => t.status === 'pendente').length}
          </span>
          <span className={styles.statLabel}>Pendentes</span>
        </div>
        <div className={styles.statCard} style={{ borderColor: '#385bad' }}>
          <span className={styles.statNumber} style={{ color: '#385bad' }}>
            {tasks.filter(t => t.status === 'em_andamento').length}
          </span>
          <span className={styles.statLabel}>Em Andamento</span>
        </div>
        <div className={styles.statCard} style={{ borderColor: '#28a745' }}>
          <span className={styles.statNumber} style={{ color: '#28a745' }}>
            {tasks.filter(t => t.status === 'concluido').length}
          </span>
          <span className={styles.statLabel}>Concluídos</span>
        </div>
      </div>

      <div className={styles.tasksList}>
        {filteredTasks.length === 0 ? (
          <div className={styles.emptyState}>
            <FaTasks className={styles.emptyIcon} />
            <p>Nenhuma tarefa encontrada</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className={styles.taskItemsContainer}
              style={{ borderLeftColor: getStatusColor(task.status) }}
            >
              <div className={styles.taskReasonRow}>
                <div className={styles.taskItemBlock}>
                  <label>Tarefa</label>
                  <span className={styles.taskReason}>{task.reason || 'Sem descrição'}</span>
                </div>
              </div>

              <div className={styles.taskMainContent}>
                <div className={styles.taskItemBlock}>
                  <label>Tipo</label>
                  <span className={styles.taskType}>
                    {task.donor_id ? (
                      <><FaUser className={styles.typeIcon} /> Doador</>
                    ) : task.receipt_donation_id ? (
                      <><FaReceipt className={styles.typeIcon} /> Recibo</>
                    ) : (
                      'Geral'
                    )}
                  </span>
                </div>

                <div className={styles.taskItemBlock}>
                  <label>Referência</label>
                  <span>
                    {task.donor?.donor_name || 
                     (task.receipt_donation_id ? `Recibo #${task.receipt_donation_id}` : '-')}
                  </span>
                </div>

                <div className={styles.taskItemBlock}>
                  <label>Solicitante</label>
                  <span>{task.operator_required_info?.operator_name || '-'}</span>
                </div>

                <div className={styles.taskItemBlock}>
                  <label>Responsável</label>
                  <span>{task.operator_conclude_info?.operator_name || 'Não atribuído'}</span>
                </div>

                <div className={styles.taskItemBlock}>
                  <label>Criado em</label>
                  <span>{formatDate(task.created_at)}</span>
                </div>

                <div className={styles.taskItemBlock}>
                  <label>Atualizado em</label>
                  <span>{formatDate(task.updated_at)}</span>
                </div>

                <div className={styles.taskActions}>
                  <div className={styles.taskItemBlock}>
                    <label htmlFor={`status-${task.id}`}>Status</label>
                    <select
                      id={`status-${task.id}`}
                      className={styles.selectStatus}
                      value={task.status || 'pendente'}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      disabled={updatingTaskId === task.id}
                      style={{ borderColor: getStatusColor(task.status) }}
                    >
                      {statusOptions.map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className={styles.btnDetails}
                    onClick={() => handleOpenDetails(task)}
                    disabled={updatingTaskId === task.id}
                  >
                    {updatingTaskId === task.id ? (
                      <FaSpinner className={styles.spinner} />
                    ) : (
                      'Ver Detalhes'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && selectedTask && (
        <ModalTaskDetails
          task={selectedTask}
          onClose={() => {
            setShowModal(false)
            setSelectedTask(null)
          }}
          onUpdate={fetchTasks}
          statusOptions={statusOptions}
        />
      )}
    </div>
  )
}

export default Tasks
