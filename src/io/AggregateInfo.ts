import { ok as assert } from "assert";
import { SortedSet } from '../collections/SortedSet';
import { ChildAggregate } from '../meta/ChildAggregate';
import { Element } from '../meta/Element';
import { Header } from '../meta/Header';
import { isAssignableFrom } from '../meta/PropertyDescriptor';
import { AggregateAttribute } from './AggregateAttribute';

export interface HeaderMap {
  [key: string]: Header;
}

export interface HeaderValues {
  [key: string]: Object;
}

/**
 * Holder for meta information about an aggregate class.
 */
export class AggregateInfo {

  private name: string;
  private attributes: SortedSet<AggregateAttribute>;
  private headers: HeaderMap;
  private owner: any;

  constructor(name: string, owner: any, parentInfo?: AggregateInfo) {
    this.name = name;
    this.owner = owner;
    this.headers = {};
    this.attributes = new SortedSet<AggregateAttribute>(AggregateAttribute.contentCompare);

    if(parentInfo) {
      for(var header in parentInfo.headers) {
        this.headers[header] = parentInfo.headers[header];
      }
      var parentAttributes: Array<AggregateAttribute> = parentInfo.attributes.values();
      for(var i in parentAttributes) {
        var attribute: AggregateAttribute = parentAttributes[i];
        this.attributes.insert(attribute);
      }
    }
  }

  /**
   * The name of the aggregate.
   *
   * @return The name of the aggregate.
   */
  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getOwner(): any {
    return this.owner;
  }

  /**
   * The attributes.
   *
   * @return The attributes.
   */
  public getAttributes(): SortedSet<AggregateAttribute> {
    return this.attributes;
  }

  /**
   * Get the attribute by the specified name.
   *
   * @param name The name of the attribute.
   * @param orderHint The order at which the attribute should come after in case there are more than one candidates.
   * @param assignableTo The class this attribute must be assignable to
   * @return The attribute by the specified name,
   * or if there are more than one by that name,
   * the first one after the specified order,
   * or if there are none then the first collection that
   * comes after the order hint, or the latest if there
   * are none that come after the order hint, or null.
   */
  public getAttribute(name: string, orderHint: number, assignableTo: any = null): AggregateAttribute {
    var candidates: Array<AggregateAttribute> = new Array<AggregateAttribute>();
    var collectionBucket: AggregateAttribute = null;
    for (var i in this.attributes.values()) {
      var attribute: AggregateAttribute = this.attributes.values()[i];
      if (name === attribute.getName()) {
        candidates.push(attribute);
      }
      else if (attribute.isArray()) {
        if (assignableTo != null) {
          // Verify it's the right generic type.
          var entryType: any = attribute.getArrayEntryType();
          if (entryType != null && !isAssignableFrom(entryType, assignableTo)) {
            // Array is of wrong type.
            continue;
          }
        }
        if (collectionBucket == null || collectionBucket.getOrder() < orderHint) {
          //the default is the first collection that comes after the order hint, or the latest if there are none that come after the order hint.
          collectionBucket = attribute;
        }
      }
    }

    if (candidates.length != 0) {
      if (candidates.length == 1) {
        return candidates[0];
      }
      else {
        for (var candidate of candidates) {
          if (candidate.getOrder() >= orderHint) {
            return candidate;
          }
        }
      }
    }

    return collectionBucket;
  }

  /**
   * Whether this aggregate has headers.
   *
   * @return Whether this aggregate has headers.
   */
  public hasHeaders(): boolean {
    return Object.keys(this.headers).length != 0;
  }

  /**
   * Get the headers defined by the specific aggregate instance.
   *
   * @param instance The aggregate instance.
   * @return The headers.
   */
  public getHeaders(instance: Object): HeaderValues {
    var headers: HeaderValues = {};
    for (var headerKey in this.headers) {
      var header: Header = this.headers[headerKey];
      var headerValue: Object = header.getReadMethod().call(instance);
      headers[header.name()] = headerValue;
    }
    return headers;
  }

  /**
   * The type of the specified header.
   *
   * @param name The header name.
   * @return The header type, or null if no header by the specified name exists.
   */
  public getHeaderType(name: string): any {
    return (name in this.headers) ? this.headers[name].getPropertyType() : null;
  }

  /**
   * Set the header value for the specified instance.
   *
   * @param instance The instance.
   * @param name     The name of the header.
   * @param value    the value of the header.
   */
  public setHeader(instance: Object, name: string, value: Object): void {
    if (name in this.headers) {
      this.headers[name].getWriteMethod().call(instance, value);
    }
  }


  public addChildAggregate(childAggregate: ChildAggregate): void {
    var attribute = new AggregateAttribute(childAggregate);
    this.attributes.insert(attribute);
  }

  public addElement(element: Element): void {
    var attribute = new AggregateAttribute(element);
    this.attributes.insert(attribute);
  }

  public addHeader(header: Header): void {
    assert(header.name());
    this.headers[header.name()] = header;
  }
}
