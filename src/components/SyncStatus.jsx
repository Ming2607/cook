import { useStore } from '../store/StoreContext'
import './SyncStatus.css'

const LABELS = {
  loading: '云端加载中…',
  syncing: '同步中…',
  synced: '云端已同步',
  offline: '本地模式',
  error: '同步失败',
}

export default function SyncStatus() {
  const { syncStatus, cloudEnabled } = useStore()

  if (!cloudEnabled && syncStatus === 'offline') return null

  return (
    <div className={`sync-status sync-${syncStatus}`} title={LABELS[syncStatus]}>
      <span className="sync-dot" />
      <span className="sync-text">{LABELS[syncStatus] || syncStatus}</span>
    </div>
  )
}
