// import { Pipe, PipeTransform, Injectable } from '@angular/core';



// @Pipe({ name: 'groupByCustomer' })
// @Injectable()
// export class GroupByCustomerPipe implements PipeTransform {
//   transform(allOrders: any[], field: string, value: string):any[] {
//     if (!allOrders) return [];
//     return allOrders.filter(it => it[field] == value);
//   }
// }

// @Pipe({name: 'groups'})
// export class GroupsPipe implements PipeTransform {
//   transform(value, args:string[]) : any {
//     var groups = {};
//     value.forEach(function(o) {
//       var group = o.NAME;
//       groups[group] = groups[group] ? groups[group] : { name: group, resources: [] };
//       groups[group].resources.push(o);  
//     });
        
//     return Object.keys(groups).map(function (key) {return groups[key]});
//   }
// }

// @Pipe({name: 'groupBy'})
// export class GroupByPipe implements PipeTransform {
//     transform(collection: Array<any>, property: string): Array<any> {
//         // prevents the application from breaking if the array of objects doesn't exist yet
//         if(!collection) {
//             return null;
//         }

//         const groupedCollection = collection.reduce((previous, current)=> {
//             if(!previous[current[property]]) {
//                 previous[current[property]] = [current];
//             } else {
//                 previous[current[property]].push(current);
//             }

//             return previous;
//         }, {});

//         // this will return an array of objects, each object containing a group of objects
//         return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
//     }
// }