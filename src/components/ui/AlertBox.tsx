import { CheckCircle } from "lucide-react"

const AlertBox = ({id, text}: {id: 'generic' | 'warning' | 'alert' | 'success' | 'danger', text: string}) => {
    const getBackgroundColor = (id: 'generic' | 'warning' | 'alert' | 'success' | 'danger') => {
        if(id === 'generic'){
            return {
               bg: 'bg-[gray]',
               icon: <CheckCircle/>
            }
        }else if(id === 'success'){
            return {
               bg: 'bg-[green]',
               icon: <CheckCircle/>
            }
        }
    }
    return (
        <div className={`flex ${getBackgroundColor(id)?.bg} boder-1 border-[var(--task-border-color-light)] gap-[10px] p-[10px] transition-opacity duration-[150ms] rounded-[8px] items-center text-[white] fixed right-[4px] top-[20px]`}>
            {getBackgroundColor(id)?.icon}
            {text}
        </div>
    )
}

export default AlertBox
