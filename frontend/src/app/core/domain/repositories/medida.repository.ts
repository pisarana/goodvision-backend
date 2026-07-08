import { Observable } from 'rxjs';
import { EvaluacionMedida, EvaluacionMedidaRequest } from '../models/medida.model';

export abstract class MedidaRepository {
  abstract findAll(): Observable<EvaluacionMedida[]>;
  abstract findById(id: number): Observable<EvaluacionMedida>;
  abstract findByCliente(idCliente: number): Observable<EvaluacionMedida[]>;
  abstract findByUsuario(idUsuario: number): Observable<EvaluacionMedida[]>;
  abstract save(medida: EvaluacionMedidaRequest): Observable<EvaluacionMedida>;
  abstract delete(id: number): Observable<void>;
}
