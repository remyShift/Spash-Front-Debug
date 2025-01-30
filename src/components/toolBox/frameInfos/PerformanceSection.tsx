import { usePerformance } from '@/context/performance';


export default function PerformanceSection() {
    const { mainTiming, persistentTiming } = usePerformance();
    if (!mainTiming || !persistentTiming) return null;

    return (
        <div className='flex flex-col gap-2'>
            <p className='text-white font-semibold text-center text-lg'>- - - - - Performances - - - - -</p>
            <div className="space-y-2">
                <div>
                    <span className="font-medium text-white">Principal:</span>
                    <span className="ml-2 text-white">{mainTiming.current.toFixed(1)}ms</span>
                    <span className="text-white ml-2">(Moy: {mainTiming.average.toFixed(1)}ms)</span>
                </div>
                <div>
                    <span className="font-medium text-white">Persistant:</span>
                    <span className="ml-2 text-white">{persistentTiming.current.toFixed(1)}ms</span>
                    <span className="text-white ml-2">(Moy: {persistentTiming.average.toFixed(1)}ms)</span>
                </div>
                <div>
                    <span className="font-medium text-white">Total:</span>
                    <span className="ml-2 text-white">{(mainTiming.current + persistentTiming.current).toFixed(1)}ms</span>
                </div>
            </div>
        </div>
    );
} 