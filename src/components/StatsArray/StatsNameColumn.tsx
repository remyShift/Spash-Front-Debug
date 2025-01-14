export default function StatsNameColumn() {
    const stats = ["Base placement", "Action placement", "Team spirit", "Hits", "Physical", "Badges", "Sentence", "Video"];
    return (
        <div className="flex flex-col gap-3">
            {stats.map((stat, index) => (
                <div key={index} className={`w-52 h-28 rounded-lg ${index % 2 === 0 ? "bg-lightBackground" : "bg-lighterBackground"} flex justify-center items-center`}>
                    <p className="text-center text-xl font-semibold text-white">{stat}</p>
                </div>
            ))}
        </div>
    ) 
}
