import { type FC, useState, useEffect } from 'react';
import UserDashBoardStyles from '@cssComponents/user-panel/containers/user-dashboard.module.css'
import Shop from './user-dashboard/Shop'
import SideBar from '../../../../../features/user/components/sidebar/SideBar'
import { useRouteContext } from '@tupynamba/fastifyreact-ts/client'

// --- Componente Auxiliar para o Contador (sem alterações) ---
interface TimeLeft {
    dias?: number;
    horas?: number;
    minutos?: number;
    segundos?: number;
}
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
    const calculateTimeLeft = (): TimeLeft => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft: TimeLeft = {};
        if (difference > 0) {
            timeLeft = {
                dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
                horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutos: Math.floor((difference / 1000 / 60) % 60),
                segundos: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);
    const timerComponents = Object.entries(timeLeft)
        .map(([interval, value]) => {
            if (value > 0) {
                return <span key={interval}>{value} {interval}{" "}</span>;
            }
            return null;
        })
        .filter(Boolean);
    return (
        <div className={UserDashBoardStyles.countdown}>
            {timerComponents.length ? timerComponents : <span>O ciclo está prestes a começar!</span>}
        </div>
    );
};


// --- Componente Principal (com a lógica corrigida) ---

const UserLayout: FC = () => {
    const { state } = useRouteContext();
    const { cycle } = state;
    
    // 1. Criamos um estado para gerenciar o status do ciclo.
    // O estado inicial é 'Carregando' para lidar com o momento da hidratação.
    const [cycleStatus, setCycleStatus] = useState<'Carregando' | 'Futuro' | 'Ativo' | 'Finalizado'>('Carregando');

    // 2. Usamos useEffect para verificar as datas.
    // Este código só vai rodar DEPOIS que o componente for montado no cliente
    // e o 'cycle' do contexto tiver seu valor final.
    useEffect(() => {
        // Se, após a montagem, o cycle ainda for nulo, significa que não há ciclo.
        if (!cycle) {
            // Poderíamos definir um status 'NenhumCiclo' ou manter 'Carregando'
            // se a busca ainda estiver ocorrendo em segundo plano.
            setCycleStatus('Carregando');
            return; // Encerra a execução do efeito aqui.
        }

        // A lógica de verificação é a mesma, mas agora ela está dentro do useEffect.
        const now = new Date();
        const openingDate = new Date(cycle.openingDate);
        const closingDate = new Date(cycle.closingDate);

        if (now < openingDate) {
            setCycleStatus('Futuro');
        } else if (now >= openingDate && now <= closingDate) {
            setCycleStatus('Ativo');
        } else {
            setCycleStatus('Finalizado');
        }
    }, [cycle]); // 3. O array de dependência [cycle] garante que este efeito rode
                 // sempre que o objeto 'cycle' mudar.

    // A função de renderização não muda, ela apenas usará o 'cycleStatus' do nosso novo estado.
    const renderContent = () => {
        switch (cycleStatus) {
            case 'Futuro':
                return (
                    <div className={UserDashBoardStyles.cycleStatusInfo}>
                        <h2>Próximo Ciclo de Vendas</h2>
                        <p>
                            As vendas começarão em: {new Date(cycle!.openingDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                        <h3>Tempo restante para a abertura:</h3>
                        <CountdownTimer targetDate={cycle!.openingDate} />
                    </div>
                );

            case 'Ativo':
                return (
                    <div className={UserDashBoardStyles.currentCycle}>
                        <div>
                            <Shop cycle={cycle} />
                            <SideBar />
                        </div>
                    </div>
                );

            case 'Finalizado':
                return (
                    <div className={UserDashBoardStyles.cycleStatusInfo}>
                        <h2>Ciclo Encerrado</h2>
                        <p>O ciclo de vendas atual foi finalizado. Aguarde o próximo!</p>
                    </div>
                );
            
            default: // 'Carregando'
                return (
                    <div className={UserDashBoardStyles.cycleStatusInfo}>
                        <p>Carregando informações do ciclo...</p>
                    </div>
                );
        }
    };

    return (
        <div className={UserDashBoardStyles.container}>
            {renderContent()}
        </div>
    );
}

export default UserLayout;