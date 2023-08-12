import { io } from "socket.io-client";

export class PeerConnectionSession {
    _room: any;
    _userId: any;
    socket: any;

    constructor(socket: any) {
        this.socket = socket;
    }

    joinRoom(link: string, userId: string) {
        this._room = link;
        this._userId = userId;
        this.socket.emit('join', { link, userId });
    }

    onUpdateUserList(callback: any) {
        this.socket.on(`${this._room}-update-user-list`, ({ users }: any) => {
            callback(users);
        });
    }

    onRemoveUser(callback: any) {
        this.socket.on(`${this._room}-remove-user`, ({ socketId }: any) => {
            callback(socketId);
        });
    }

    updateUserMovement(data: any) {
        this.socket.emit('move', data);
    }

    updateUserMute(data: any) {
        this.socket.emit('toggl-mute-user', data);
    }
}

export const createPeerConnectionContext = () => {

    const { VITE_PUBLIC_WS_URL } = import.meta.env;

    const socket = io(VITE_PUBLIC_WS_URL);

    return new PeerConnectionSession(socket);
}