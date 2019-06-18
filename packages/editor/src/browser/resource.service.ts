import { ResourceService, IResource, IResourceProvider, ResourceNeedUpdateEvent, ResourceDidUpdateEvent, IResourceDecoration, ResourceDecorationChangeEvent } from '../common';
import { Injectable, Autowired } from '@ali/common-di';
import { URI, IDisposable, getLogger, WithEventBus, OnEvent } from '@ali/ide-core-browser';
import { observable } from 'mobx';

@Injectable()
export class ResourceServiceImpl extends WithEventBus implements ResourceService {

  private providers: Map<string, IResourceProvider> = new Map();

  private resources: Map<string, IResource> = new Map();

  private resourceDecoration: Map<string, IResourceDecoration> = new Map();

  constructor() {
    super();
  }

  @OnEvent(ResourceNeedUpdateEvent)
  onResourceNeedUpdateEvent(e: ResourceNeedUpdateEvent) {
    const uri = e.payload;
    if (this.resources.has(uri.toString())) {
      const resource = this.getResource(uri);
      this.doGetResource(uri).then((newResource) => {
        Object.assign(resource, newResource);
        this.eventBus.fire(new ResourceDidUpdateEvent(uri));
      });
    }
  }

  @OnEvent(ResourceDecorationChangeEvent)
  onResourceDecorationChangeEvent(e: ResourceDecorationChangeEvent) {
    this.getResourceDecoration(e.payload.uri); // ensure object
    Object.assign(this.resourceDecoration.get(e.payload.uri.toString()), e.payload.decoration);
  }

  async getResource(uri: URI): Promise<IResource<any> | null> {
    if (!this.resources.has(uri.toString())) {
      const resource = observable(Object.assign({}, (await this.doGetResource(uri))));
      this.resources.set(uri.toString(), resource);
    }
    return this.resources.get(uri.toString()) as IResource;
  }

  async doGetResource(uri: URI): Promise<IResource<any> | null> {
    const provider = this.providers.get(uri.scheme);
    if (!provider) {
      getLogger().error('URI has no resource provider: ' + uri);
      return null; // no provider
    } else {
      return provider.provideResource(uri);
    }
  }

  registerResourceProvider(provider: IResourceProvider): IDisposable {
    const scheme = provider.scheme;
    this.providers.set(scheme, provider);
    return {
      dispose: () => {
        if (this.providers.get(scheme) === provider) {
          this.providers.delete(scheme);
        }
      },
    };
  }

  async shouldCloseResource(resource: IResource, openedResources: IResource[][]): Promise<boolean> {
    const provider = this.providers.get(resource.uri.scheme);
    if (!provider || !provider.shouldCloseResource) {
      return true;
    } else {
      return await provider.shouldCloseResource(resource, openedResources);
    }
  }

  public getResourceDecoration(uri: URI): IResourceDecoration {
    if (!this.resourceDecoration.has(uri.toString())) {
      this.resourceDecoration.set(uri.toString(), observable(DefaultResourceDecoration));
    }
    return this.resourceDecoration.get(uri.toString()) as IResourceDecoration;
  }

}

const  DefaultResourceDecoration: IResourceDecoration = {
  dirty: false,
};
