# Riferimento alla Valutazione: Metriche e Implementazione

Questo documento fornisce dettagli implementativi per le metriche di valutazione e i sistemi di valutazione.

## Definizioni delle Metriche Core

### Accuratezza Fattuale

L'accuratezza fattuale misura se le affermazioni nell'output dell'agent corrispondono alla ground truth (verità di base).

```
Eccellente (1.0): Tutte le affermazioni verificate contro la ground truth, nessun errore
Buono (0.8): Errori minori che non influenzano le conclusioni principali
Accettabile (0.6): Affermazioni principali corrette, presenti minori inesattezze
Scarso (0.3): Errori fattuali significativi nelle affermazioni chiave
Fallito (0.0): Errori fattuali fondamentali che invalidano l'output
```

Approccio di calcolo:
- Estrai le affermazioni dall'output
- Verifica ogni affermazione contro la ground truth
- Pondera le affermazioni per importanza (le affermazioni principali hanno più peso)
- Calcola la media ponderata dell'accuratezza delle affermazioni

### Completezza

La completezza misura se l'output copre tutti gli aspetti richiesti.

```
Eccellente (1.0): Tutti gli aspetti richiesti coperti accuratamente
Buono (0.8): La maggior parte degli aspetti coperti con lacune minori
Accettabile (0.6): Aspetti chiave coperti, alcune lacune
Scarso (0.3): Aspetti principali mancanti dall'output
Fallito (0.0): Aspetti fondamentali non affrontati
```

### Accuratezza delle Citazioni

L'accuratezza delle citazioni misura se le fonti citate corrispondono alle fonti dichiarate.

```
Eccellente (1.0): Tutte le citazioni accurate e complete
Buono (0.8): Problemi minori di formattazione delle citazioni
Accettabile (0.6): Citazioni principali accurate
Scarso (0.3): Problemi significativi con le citazioni
Fallito (0.0): Citazioni mancanti o completamente errate
```

### Qualità delle Fonti

La qualità delle fonti misura se sono state utilizzate fonti primarie appropriate.

```
Eccellente (1.0): Fonti primarie autorevoli
Buono (0.8): Prevalentemente fonti primarie con alcune secondarie
Accettabile (0.6): Mix di fonti primarie e secondarie
Scarso (0.3): Prevalentemente fonti secondarie o inaffidabili
Fallito (0.0): Nessuna fonte credibile citata
```

### Efficienza dei Tool

L'efficienza dei tool misura se l'agente ha utilizzato gli strumenti appropriati un numero ragionevole di volte.

```
Eccellente (1.0): Selezione tool e numero chiamate ottimali
Buono (0.8): Buona selezione tool con inefficienze minori
Accettabile (0.6): Tool appropriati con qualche ridondanza
Scarso (0.3): Tool sbagliati o numero chiamate eccessivo
Fallito (0.0): Grave abuso di tool o chiamate estremamente eccessive
```

## Implementazione della Rubrica

```python
EVALUATION_DIMENSIONS = {
    "factual_accuracy": {
        "weight": 0.30,
        "description": "Claims match ground truth",
        "levels": {
            "excellent": 1.0,
            "good": 0.8,
            "acceptable": 0.6,
            "poor": 0.3,
            "failed": 0.0
        }
    },
    "completeness": {
        "weight": 0.25,
        "description": "All requested aspects covered",
        "levels": {
            "excellent": 1.0,
            "good": 0.8,
            "acceptable": 0.6,
            "poor": 0.3,
            "failed": 0.0
        }
    },
    "citation_accuracy": {
        "weight": 0.15,
        "description": "Citations match sources",
        "levels": {
            "excellent": 1.0,
            "good": 0.8,
            "acceptable": 0.6,
            "poor": 0.3,
            "failed": 0.0
        }
    },
    "source_quality": {
        "weight": 0.10,
        "description": "Appropriate primary sources used",
        "levels": {
            "excellent": 1.0,
            "good": 0.8,
            "acceptable": 0.6,
            "poor": 0.3,
            "failed": 0.0
        }
    },
    "tool_efficiency": {
        "weight": 0.20,
        "description": "Right tools used reasonably",
        "levels": {
            "excellent": 1.0,
            "good": 0.8,
            "acceptable": 0.6,
            "poor": 0.3,
            "failed": 0.0
        }
    }
}

def calculate_overall_score(dimension_scores, rubric):
    """Calculate weighted overall score from dimension scores."""
    total_weight = 0
    weighted_sum = 0
    
    for dimension, score in dimension_scores.items():
        if dimension in rubric:
            weight = rubric[dimension]["weight"]
            weighted_sum += score * weight
            total_weight += weight
    
    return weighted_sum / total_weight if total_weight > 0 else 0
```

## Gestione del Set di Test

```python
class TestSet:
    def __init__(self, name):
        self.name = name
        self.tests = []
        self.tags = {}
    
    def add_test(self, test_case):
        """Add test case to test set."""
        self.tests.append(test_case)
        
        # Index by tags
        for tag in test_case.get("tags", []):
            if tag not in self.tags:
                self.tags[tag] = []
            self.tags[tag].append(len(self.tests) - 1)
    
    def filter(self, **criteria):
        """Filter tests by criteria."""
        filtered = []
        for test in self.tests:
            match = True
            for key, value in criteria.items():
                if test.get(key) != value:
                    match = False
                    break
            if match:
                filtered.append(test)
        return filtered
    
    def get_complexity_distribution(self):
        """Get distribution of tests by complexity."""
        distribution = {}
        for test in self.tests:
            complexity = test.get("complexity", "medium")
            distribution[complexity] = distribution.get(complexity, 0) + 1
        return distribution
```

## Runner di Valutazione

```python
class EvaluationRunner:
    def __init__(self, test_set, rubric, agent):
        self.test_set = test_set
        self.rubric = rubric
        self.agent = agent
        self.results = []
    
    def run_all(self, verbose=False):
        """Run evaluation on all tests."""
        self.results = []
        
        for i, test in enumerate(self.test_set.tests):
            if verbose:
                print(f"Running test {i+1}/{len(self.test_set.tests)}")
            
            result = self.run_test(test)
            self.results.append(result)
        
        return self.summarize()
    
    def run_test(self, test):
        """Run single evaluation test."""
        # Get agent output
        output = self.agent.run(test["input"])
        
        # Evaluate
        evaluation = self.evaluate_output(output, test)
        
        return {
            "test": test,
            "output": output,
            "evaluation": evaluation
        }
    
    def evaluate_output(self, output, test):
        """Evaluate agent output against test."""
        ground_truth = test.get("expected", {})
        
        dimension_scores = {}
        for dimension, config in self.rubric.items():
            score = self.evaluate_dimension(
                output, ground_truth, dimension, config
            )
            dimension_scores[dimension] = score
        
        overall = calculate_overall_score(dimension_scores, self.rubric)
        
        return {
            "overall_score": overall,
            "dimension_scores": dimension_scores,
            "passed": overall >= 0.7
        }
    
    def summarize(self):
        """Summarize evaluation results."""
        if not self.results:
            return {"error": "No results"}
        
        passed = sum(1 for r in self.results if r["evaluation"]["passed"])
        
        dimension_totals = {}
        for dimension in self.rubric.keys():
            dimension_totals[dimension] = {
                "total": 0,
                "count": 0
            }
        
        for result in self.results:
            for dimension, score in result["evaluation"]["dimension_scores"].items():
                if dimension in dimension_totals:
                    dimension_totals[dimension]["total"] += score
                    dimension_totals[dimension]["count"] += 1
        
        dimension_averages = {}
        for dimension, data in dimension_totals.items():
            if data["count"] > 0:
                dimension_averages[dimension] = data["total"] / data["count"]
        
        return {
            "total_tests": len(self.results),
            "passed": passed,
            "failed": len(self.results) - passed,
            "pass_rate": passed / len(self.results) if self.results else 0,
            "dimension_averages": dimension_averages,
            "failures": [
                r for r in self.results 
                if not r["evaluation"]["passed"]
            ]
        }
```

## Monitoraggio in Produzione

```python
class ProductionMonitor:
    def __init__(self, sample_rate=0.01):
        self.sample_rate = sample_rate
        self.samples = []
        self.alert_thresholds = {
            "pass_rate_warning": 0.85,
            "pass_rate_critical": 0.70
        }
    
    def sample_and_evaluate(self, query, output):
        """Sample production interaction for evaluation."""
        if random.random() > self.sample_rate:
            return None
        
        evaluation = evaluate_output(output, {}, EVALUATION_RUBRIC)
        
        sample = {
            "query": query[:200],
            "output_preview": output[:200],
            "score": evaluation["overall_score"],
            "passed": evaluation["passed"],
            "timestamp": current_timestamp()
        }
        
        self.samples.append(sample)
        return sample
    
    def get_metrics(self):
        """Calculate current metrics from samples."""
        if not self.samples:
            return {"status": "insufficient_data"}
        
        passed = sum(1 for s in self.samples if s["passed"])
        pass_rate = passed / len(self.samples)
        
        avg_score = sum(s["score"] for s in self.samples) / len(self.samples)
        
        return {
            "sample_count": len(self.samples),
            "pass_rate": pass_rate,
            "average_score": avg_score,
            "status": self._get_status(pass_rate)
        }
    
    def _get_status(self, pass_rate):
        """Get status based on pass rate."""
        if pass_rate < self.alert_thresholds["pass_rate_critical"]:
            return "critical"
        elif pass_rate < self.alert_thresholds["pass_rate_warning"]:
            return "warning"
        else:
            return "healthy"
```
