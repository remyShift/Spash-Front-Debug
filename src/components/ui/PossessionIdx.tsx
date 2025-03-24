export default function PossessionIdx({ possessionIdx }: { possessionIdx: number }) {
    let teamColor: string;
  
    if (possessionIdx === 0) {
      teamColor = "Blue";
    } else {
      teamColor = "Orange";
    }
  
    return (
      <div className="absolute bottom-5 left-10 z-50 min-w-24 flex items-center p-2 bg-gray-800 rounded-md">
        <p className="text-white text-sm">Possession : {teamColor}</p>
      </div>
    );
  }
  