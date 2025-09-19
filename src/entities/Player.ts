/**
 * Represents a player's win/loss history as a string of 'W' and 'L' characters.
 * 
 * Ex: 'W', 'WW', 'WL', 'LWL', etc.
 */
export type WinLossHistoryString = string

export class Player {
    public winLossHistory: WinLossHistoryString = ''
    
    constructor(public name: string) {}

    public addVictory(): void {
        this.winLossHistory += 'W'
    }

    public addDefeat(): void {
        this.winLossHistory += 'L'
    }

    public removeLastRoundResult(): void {
        this.winLossHistory = this.winLossHistory.slice(0, -1)
    }

    public toJSON(): Record<any, any> {
        return {
            name: this.name,
            winLossHistory: this.winLossHistory
        }
    }

    public static fromJSON(data: Record<any, any>): Player {
        const player = new Player(data.name)
        player.winLossHistory = data.winLossHistory
        return player
    }
}