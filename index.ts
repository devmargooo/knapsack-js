type Item = {
    weight: number;
    cost: number;
    name: string;
}

type Decision = {
    items: Item[];
    total_cost: number;
}
  
const capacity = 4;
  
const getTotalCost = (items:Item[]) => items.reduce((acc, cur) => acc + cur.cost, 0);

const createKnapsackTable = (items_count: number, capacity: number):Item[][][] => new Array(items_count)
    .fill(null)
    .map(() => new Array(capacity)
    .fill(null)
    .map(() => ([])));
  
function resolveKnapsack(items:Item[], capacity:number):Decision {
    const getLastMax = (i: number, j: number):Item[] | null => {
        if (i === 0) {
            // can not get last max result for the first item
            return null;
        }
        return knapsack_table[i - 1][j];
    }

    const getCurrentResult = (i: number, j: number, current_item: Item, current_knapsack_size: number):Item[] => {
        const diff = current_knapsack_size - current_item.weight;
        if (!diff) {
            return [current_item];
        }
        return [current_item, ...knapsack_table[i - 1][j - diff]];
    }

    const knapsack_table = createKnapsackTable(items.length, capacity);

    for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < capacity; j++) {
            const current_item = items[i];
            const current_knapsack_size = j + 1;
            const last_max = getLastMax(i, j);

            if (current_item.weight > current_knapsack_size) {
                if (last_max) {
                    knapsack_table[i][j].push(...knapsack_table[i - 1][j])
                }
                continue;
            }

            if (current_item.weight <= current_knapsack_size) {
                if (!last_max) {
                    knapsack_table[i][j].push(current_item);
                    continue;
                }
                const last_max_total_cost = getTotalCost(last_max);
                const current_result = getCurrentResult(i, j, current_item, current_knapsack_size);
                const current_result_total_cost = getTotalCost(current_result);

                if (last_max_total_cost > current_result_total_cost) {
                    knapsack_table[i][j].push(...last_max);
                } else {
                    knapsack_table[i][j].push(...current_result);
                }

            }
        }
    }

    const result = knapsack_table[items.length - 1][ capacity - 1 ];
    return {
        items: result,
        total_cost: getTotalCost(result),
    }
}
  

const test1: Item[] = [
    { weight: 1, cost: 1500, name: 'мини-гитара' },
    { weight: 4, cost: 3000, name: 'бензопила' },
    { weight: 3, cost: 2000, name: 'ноутбук' },
];

console.log(resolveKnapsack(test1, capacity));
  