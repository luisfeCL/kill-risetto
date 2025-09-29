import { normalize } from "../../helpers/string.helper";
import { DifficultyType } from "../game/game.interface";
import GameService from "../game/game.service";
import { User } from "../user/user.interface";

export default class UserService {
    public static currentUser: User | null;

    public static createUser( userName: string ): User | undefined{
        const existing = this._findUser( normalize( userName ) );

        if( !existing ){ 
            const newUser = this._getUserTemplate( userName )
            this._addUser( newUser );
            this.currentUser = newUser;
            return;
        };

        this.currentUser = existing;
    }

    public static getCurrentUser(): User | null {
        return this.currentUser
    }
    
    public static updateUserData( difficulty: DifficultyType, newScore?: number ){
        if(!this.currentUser) return;
        const { scores, lastDifficulty } = this.currentUser,
                prevDifficulty = lastDifficulty,
                currenDifficulty = difficulty,
                prevScore = scores[ difficulty ],
                currentScore = newScore || 0,
                isHigher = newScore && newScore > prevScore,
                isNewDifficulty = prevDifficulty !== currenDifficulty

        if(!isHigher && !isNewDifficulty) return;
        if( isHigher ) this._updateMaxScore( currenDifficulty, prevScore, currentScore  );
        if( isNewDifficulty ) this._updateLastDifficulty( currenDifficulty );

        this._updateUser( this.currentUser )
    }

    public static getMaxScore(){
        return this.currentUser?.scores[ GameService.currenDifficulty ]
    }
    
    // Propiedades privadas
    private static _updateMaxScore( difficulty: DifficultyType, prevScore: number,  newScore: number ): void {
        if( !this.currentUser ) return;
        const { scores } = this.currentUser;

        scores[difficulty] = Math.max( prevScore, newScore );
    }

    private static _updateLastDifficulty( currenDifficulty: DifficultyType ){
        if( !this.currentUser ) return;

        this.currentUser.lastDifficulty = currenDifficulty;
    }

    private static _getUsers(){
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        if( users ) return users
    }

    private static _getUserTemplate( name: string ): User{
        const normalizedName = normalize( name );
        const template: User = {
            name: normalizedName,
            displayName: name,
            scores: { easy: 0, medium: 0, hard: 0 },
            lastDifficulty: 'easy'
        };

        return template
    }

    private static _addUser( user: User ){
        const currentUsers = this._getUsers();
        const updatedUsers = [ ...currentUsers, user ];

        console.log(currentUsers, updatedUsers)
        
        localStorage.setItem('users', JSON.stringify( updatedUsers ))
    }

    private static _updateUser( userData: User ){
        let users: User[] = this._getUsers();
        const index = this._getUsers().findIndex(( user: User ) => user.name === userData.name);
        
        users[ index ] = userData
        localStorage.setItem('users', JSON.stringify( users ))
    }

    public static _findUser( userName: string ): User | undefined{
        const existing = this._getUsers().find(( user: User ) => user.name === userName);

        if ( !existing ) return;
        return existing;
    }
}