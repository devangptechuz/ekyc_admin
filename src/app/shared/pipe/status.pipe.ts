import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'roleCheck'})
export class RoleCheckPipe implements PipeTransform {
    transform(value) {
        const role = []
        if(value && value.length > 0){
            value.forEach((data)=>{
                if(data == '1'){
                    role.push('Admin');
                }
                if(data == '2'){
                    role.push('WebMaster');
                }
                if(data == '3'){
                    role.push('Editor');
                }
                if(data == '4'){
                    role.push('Moderator');
                }
                if(data == '5'){
                    role.push('Speaker');
                }
            })
        }
        return role;
    }
}


