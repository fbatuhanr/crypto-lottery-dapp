import React from 'react';

const OwnedTickets = ({userTickets}:any) => {
    return (
        <div className="stats">
            <p>You have {userTickets} Tickets in this draw</p>
            <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
                {
                    Array(userTickets).fill("").map((_,index) =>
                        <p key={index}
                           className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic"
                        >
                            {index + 1}
                        </p>
                    )
                }
            </div>
        </div>
    );
};

export default OwnedTickets;