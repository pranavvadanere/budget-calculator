var budgetController = (function(){
    var Expense = function(id,description,value){
        this.id = id;
        this.description= description;
        this.value=value;
        this.percentage=-1;

    };
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome>0){
        this.percentage = Math.round((this.value / totalIncome)*100); 
        }else{
            this.percentage = -1;
            
        }
         
    };
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    var Income = function(id,description,value){
        this.id = id;
        this.description= description;
        this.value=value;    
    };
    var data= {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum+=current.value;
        });
        data.totals[type]= sum;
        
    };
    return{
        addItem: function(type,des,val){
            var newItem,ID;
            //TO create ID
            if(data.allItems[type].length>0){
            ID = data.allItems[type][data.allItems[type].length-1].id +1;
            }else{
                ID=0;
            }
            
            //create new item based on 
            if(type === 'exp'){
                newItem = new Expense(ID,des,val);
                
            }else if (type==='inc'){
                newItem = new Income(ID,des,val);
            }
            //add to data structure
            data.allItems[type].push(newItem);
            
            return newItem;
        },
        deleteItem: function(type,id){
            //id 6
            //[1 4 5 6 8]
            // want to dlt 6
            var ids, index;
            
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);
            
            if(index!==-1){
                 data.allItems[type].splice(index,1);
                
            }
            
        },
        
        
        
        
        
        calculateBudget: function(){
            //cal total inc and exp
            calculateTotal('inc');
            calculateTotal('exp');
            
            // cal budget inc - exp
            data.budget = data.totals.inc- data.totals.exp;
            
            // cal percentage
            if(data.totals.inc>0){
                data.percentage= Math.round((data.totals.exp/data.totals.inc)*100);

            }else {
                data.percentage = -1;
            }
            
            
        },
        calculatePercentages: function(){
            
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });  
        },
        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
            
        },
        
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
            
        },
        testing: function(){
            console.log(data);
        
    }
    };
    
})();

var UIController = (function(){
    
    //some code
    
    var DOMstrings = {
        inptType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
        var formatNumber = function(num,type){
        
        var splitNum,int,dec;
        
        /*
        + or - before no
        exactly 2 dec pts, comma sepatred for thousand
        1234.31212 --> 1,234.31
        
        */
        num = Math.abs(num);
        num = num.toFixed(2);
        splitNum = num.split('.');
        int = splitNum[0];
        
        
        if(int.length>3){
            int = int.substr(0,int.length - 3) + ',' + int.substr(int.length-3,3);
            
        }
        dec = splitNum[1];
        return (type==='exp' ? '-': '+')+' '+int+'.'+dec;
        
        
    };
   var nodeListForEach = function(list, callback){
   for (var i =0;i<list.length;i++){
   callback(list[i],i);
   }
};
    
    
    
    
return{
    getInput: function(){
        return{
            type: document.querySelector(DOMstrings.inptType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value:  parseFloat(document.querySelector(DOMstrings.inputValue).value)
        };
    },
    addListItem: function(obj,type){
        var html,newHtml,element;
        
        //create html string 
            if(type==='exp'){
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type==='inc'){
                element = DOMstrings.incomeContainer;
                        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
        
        //replace place holder with actual data
        newHtml = html.replace('%id%',obj.id);
        newHtml = newHtml.replace('%description%',obj.description);
        newHtml= newHtml.replace('%value%',formatNumber(obj.value,type));
        //insert html into dom
        document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        
        
        
    },
    deleteListItem: function(selectorID){
        var el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
         
    },
    
    clearFields: function(){
        var field,fieldsArr;
        fields = document.querySelectorAll(DOMstrings.inputDescription +', '+ DOMstrings.inputValue);
        fieldsArr= Array.prototype.slice.call(fields);
        fieldsArr.forEach(function(current, index, array){
            current.value = "";
            
        });
        fieldsArr[0].focus();
        
        
        
    },
    displayBudget: function(obj){
        var type;
        obj.budget>0 ? type = 'inc' : type = 'exp';
        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,type);
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,type);
        
    if(obj.percentage>0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
    }else{
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
    }
            
    },
    displayPercentages:function(percentages){
        var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
        
        
        nodeListForEach(fields,function(current,index){
            if(percentages[index]> 0){
            current.textContent = percentages[index] +'%';
            }else{
            current.textContent = '---';

            }
        });
    },
    displayMonth : function(){
        var now,year,month,months;
        now = new Date();
        year = now.getFullYear();
        months = ['January','February','March','April','May','June','July','August','September','Ocober','November','December'];
        month = now.getMonth();
        document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' '+ year;
        
        
    },
    changedType: function(){
        var fields = document.querySelectorAll(
            DOMstrings.inptType + ',' +
            DOMstrings.inputDescription+','+
            DOMstrings.inputValue);
        nodeListForEach(fields,function(cur){
            cur.classList.toggle('red-focus');
        });
        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    },

    
    getDOMstrings: function(){
    return DOMstrings;
}
        
}; 
    
})();   




var controller = (function(budgetctr,UIctr){
    //
    
    var setupEventListener = function(){
        var DOM= UIctr.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
    
    document.addEventListener('keypress',function(Event){
        if(Event.keyCode===13){
            ctrlAddItem();
        }
    });
        
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        document.querySelector(DOM.inptType).addEventListener('change',UIctr.changedType);
        
        
    };
    
    
    var updateBudget = function(){
                
        //4 calculate budget
        budgetctr.calculateBudget();
        // return budget
        var budget = budgetctr.getBudget();
        //5 disply bdget to UI
        UIctr.displayBudget(budget);
        
    };
    var updatePercentages=function(){
        //cal percentages
        budgetctr.calculatePercentages();
        //read percentage from budgectrl
        var percentages= budgetctr.getPercentages();
        //update UI with new percentages
        UIctr.displayPercentages(percentages);
    };
    
    
    var ctrlAddItem = function(){
        
        var input,newItem;
                //1 get i/p
         input = UIctr.getInput();
        console.log(input);
        
        if(input.description!==""  &&  !isNaN(input.value) && input.value> 0){
        //2 add itm to budget controller
         newItem= budgetctr.addItem(input.type,input.description,input.value);
        //3 add itm to UI 
        newItem = UIctr.addListItem(newItem,input.type);
        //clr input field
        UIctr.clearFields();
        //update budget
        updateBudget();
            
        //update percentages
            updatePercentages();
            
    }
        

        
    };
    var ctrlDeleteItem = function(event){
        var itemID,splitID,type,ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type= splitID[0];
            ID = parseInt(splitID[1]);
            //dlt from data structre
            budgetctr.deleteItem(type,ID);
            
            // dlt from UI 
            UIctr.deleteListItem(itemID);
            
            // show updated budget
            updateBudget();
            
            // updated percentage
            updatePercentages();
            
            
            
        }
        
        
        
    };
    return{
        init: function(){
            console.log('application has started');
            
            UIctr.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp:0,
                percentage: -1
            });
            UIctr.displayMonth();
            setupEventListener();
        }
        
    };
    
    
})(budgetController,UIController);

controller.init(); 