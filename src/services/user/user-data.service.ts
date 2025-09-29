import { normalize } from "../../helpers/string.helper";
import { DifficultyType } from "../game/game.interface";
import GameService from "../game/game.service";
import { User } from "../user/user.interface";

export default class UserService {
    public static currentUser: User | null;

    private static item: string = "users"
    private static defaultDifficulty: DifficultyType = "easy"

    public static createUser( userName: string ): User | undefined{
        const normalizedName = normalize( userName );
        const userAlreadyExist = this._checkName( normalizedName );

        if( !userAlreadyExist ){
            const newUser = this._getUserTemplate( userName )
            this._addUser( newUser );
            this.currentUser = newUser;
            return;
        }
        
        const id = this._getUserId( normalizedName );
        const user = this._findUser( id );

        this.currentUser = user!
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
        const users = JSON.parse(localStorage.getItem( this.item ) || "[]");

        if( users ) return users
    }

    private static _getUserTemplate( name: string ): User{
        const uuid = crypto.randomUUID(),
              normalizedName = normalize( name ),
              template: User = {
                id: uuid,
                name: normalizedName,
                displayName: name,
                scores: { easy: 0, medium: 0, hard: 0 },
                lastDifficulty: this.defaultDifficulty
            };

        return template
    }

    private static _addUser( user: User ){
        const currentUsers = this._getUsers();
        const updatedUsers = [ ...currentUsers, user ];
        
        localStorage.setItem(this.item, JSON.stringify( updatedUsers ))
    }

    private static _updateUser( userData: User ){
        let users: User[] = this._getUsers();
        const index = this._getUsers().findIndex(( user: User ) => user.id === userData.id);
        
        users[ index ] = userData;
        localStorage.setItem(this.item, JSON.stringify( users ));
    }

    private static _findUser( id: string ): User | undefined{
        const user = this._getUsers().find(( user: User ) => user.id === id);

        if ( !user ) return;
        return user;
    }

    private static _checkName( userName: string ): boolean{
        const users = this._getUsers();
        const nameAlreadyExist = users.some( (user: User) => user.name === userName)

        return nameAlreadyExist
    }

    private static _getUserId( userName: string ): string {
        const user = this._getUsers().find(( user: User ) => user.name === userName);

        return user.id;
    }
}